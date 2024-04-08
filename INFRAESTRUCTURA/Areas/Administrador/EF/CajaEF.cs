using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
    public class CajaEF:ICajaEF
    {
        private readonly Modelo db;

        private readonly UserManager<AppUser> Usuario;

        public CajaEF(Modelo context, UserManager<AppUser> _Usuario)
        {
            db = context;
            Usuario = _Usuario;
        }

        public CajaSucursal BuscarCajaSucursal(int idcajasucursal)
        {
            return db.CAJASUCURSAL.Find(idcajasucursal);
        }

        public List<Caja> ListarCajas()
        {
            return db.CAJA.Where(x => x.estado == "HABILITADO").ToList();
        }
        public object ListarCajasSucursal(int idsucursal)
        {
            var query = (from cs in db.CAJASUCURSAL 
                         join s in db.SUCURSAL on cs.idsucursal equals s.suc_codigo
                         join c in db.CAJA on cs.idcaja equals c.idcaja
                         where cs.estado=="HABILITADO" && cs.idsucursal==idsucursal
                         select new
                         {
                             idcaja=c.idcaja,
                             nombre=c.descripcion,
                             idcajasucursal=cs.idcajasucursal
                         }).ToList();
            return query;
        }
        public async Task<object> ListarCorrelativosPorCajaAsync(int idcajasucursal)
        {

            var query = await (from c in db.CORRELATIVODOCUMENTO
                               join d in db.FDOCUMENTOTRIBUTARIO on c.iddocumento equals d.iddocumento
                               where c.idcajasucursal == idcajasucursal
                               orderby d.iddocumento descending
                               select new
                               {
                                   idcorrelativo = c.idcorrelativo,
                                   iddocumento = c.iddocumento,
                                   estado = c.estado,
                                   documento = d.descripcion,
                                   empieza = c.empieza,
                                   termina = c.termina,
                                   actual = c.actual,
                                   serie = c.serie

                               }).ToListAsync();
            return query;

        }

        public mensajeJson RegistrarEditarCorrelativosPorCaja(CorrelativoDocumento obj)
        {
            try
            {
              
                var aux = db.CORRELATIVODOCUMENTO.Where(x => x.idcajasucursal == obj.idcajasucursal && x.iddocumento == obj.iddocumento && x.serie==obj.serie).FirstOrDefault();
                var idsucursal = db.CAJASUCURSAL.Find(obj.idcajasucursal).idsucursal;
                var sucursal = db.SUCURSAL.Find(idsucursal);
                if (obj.idcorrelativo == 0)
                {
                    var auxserie = (from cd in db.CORRELATIVODOCUMENTO
                                   join cs in db.CAJASUCURSAL on cd.idcajasucursal equals cs.idcajasucursal
                                   join s in db.SUCURSAL on cs.idsucursal equals s.suc_codigo
                                   where cd.serie==obj.serie && s.idempresa==sucursal.idempresa
                                   select cd).ToList().Count;
                    
                    if (auxserie > 0)
                        return new mensajeJson("La serie ya ha sido registrada", null);
                    if ((aux is null))
                    {
                        obj.actual = obj.empieza;
                        db.Add(obj);
                        db.SaveChanges();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        return (new mensajeJson("El registro ya existe", null));
                    }
                }
                else
                {
                    var auxserie = (from cd in db.CORRELATIVODOCUMENTO
                                    join cs in db.CAJASUCURSAL on cd.idcajasucursal equals cs.idcajasucursal
                                    join s in db.SUCURSAL on cs.idsucursal equals s.suc_codigo
                                    where cd.serie == obj.serie && s.idempresa == sucursal.idempresa
                                    && cs.idcajasucursal!=obj.idcajasucursal
                                    select cd).ToList().Count;
                    //var auxserie = db.CORRELATIVODOCUMENTO.Where(x => x.serie == obj.serie && x.idcajasucursal!=obj.idcajasucursal).ToList().Count;
                    if (auxserie > 0)
                        return new mensajeJson("La serie ya ha sido registrada", null);
                    if (aux is null)
                        return (new mensajeJson("Estas intentando actualizar un registro que no ha sido creado", null));
                    else if (aux.idcorrelativo == obj.idcorrelativo)
                    {
                        if (obj.empieza > aux.actual)
                            obj.actual = obj.empieza;
                        else if (obj.empieza == aux.empieza)
                            obj.actual = aux.actual;
                        else if (obj.empieza < aux.actual && obj.serie == aux.serie)
                            return (new mensajeJson("El correlativo de inicio es menor al ultimo correlativo, pueden generarse conflictos al crear los registros.", null));
                        else
                            obj.actual = obj.empieza;

                        db.Update(obj);
                         db.SaveChanges();
                        return (new mensajeJson("ok", obj));

                    }
                    else
                        return (new mensajeJson("El registro ya existe", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public mensajeJson ActualizarDatosCaja(CajaSucursal obj)
        {
            try
            {
               
                var caja = db.CAJASUCURSAL.Find(obj.idcajasucursal);
                caja.nombreimpresora = obj.nombreimpresora;
                caja.serieimpresora = obj.serieimpresora;
                caja.ipimpresora = obj.ipimpresora;
                if(obj.correlativoasociadoaotracaja.Value)
                {
                    if (obj.idcajacorrelativoasociado != caja.idcajacorrelativoasociado)
                    {
                        //verifica si la caja que asocio tiene correlativos
                        var correlativos = db.CORRELATIVODOCUMENTO.Where(x => x.idcajasucursal == obj.idcajacorrelativoasociado).ToList();
                        if (correlativos.Count == 0)
                            return new mensajeJson("La caja que usted esta asociando no tiene correlativos asignados", null);
                        caja.correlativoasociadoaotracaja = obj.correlativoasociadoaotracaja;
                        caja.idcajacorrelativoasociado = obj.idcajacorrelativoasociado;
                    }
                    else
                        return new mensajeJson("La caja que asocia debe ser distinta a la actual", null);
                   
                }else
                {
                    caja.correlativoasociadoaotracaja = false;
                    caja.idcajacorrelativoasociado = null;
                }
              

                db.Update(caja);
                db.SaveChanges();
                return new mensajeJson("ok", null);
                
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
    }
}
