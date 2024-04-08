using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Modelos;
using System;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Text;
using ENTIDADES.Finanzas;
using System.Threading.Tasks;
using Erp.SeedWork;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using ENTIDADES.Generales;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
   public class CorrelativoDocumentoEF:ICorrelativoDocumentoEF
    {
        private readonly Modelo db;
     
        public CorrelativoDocumentoEF(Modelo context)
        {
            db = context;            
        }

        public Task<mensajeJson> BuscarAsync(int id)
        {
            throw new NotImplementedException();
        }

        public FDocumentoTributario BuscarDocumento(string id)
        {
            throw new NotImplementedException();
        }

        public Task<mensajeJson> EliminarAsync(int? id)
        {
            throw new NotImplementedException();
        }

        public Task<mensajeJson> HabilitarAsync(int? id)
        {
            throw new NotImplementedException();
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
                                      estado = c.estado,
                                      documento = d.descripcion,
                                      empieza = c.empieza,
                                      termina = c.termina,
                                      actual = c.actual,
                                      seriedocumento = c.serie

                                  }).ToListAsync();
                return query;
          
        }

        public Task<mensajeJson> RegistrarEditarAsync(CorrelativoDocumento obj)
        {
            throw new NotImplementedException();
        }

        //public async Task<List<FCorrelativoDocumentoSucursal>> ListarAsync(int suc_codigo)
        //{
        //    try
        //    {
        //        var query =await (from c in db.FCORRELATIVODOCUMENTOT
        //                         //join s in db.SUCURSAL on c.suc_codigo equals s.suc_codigo
        //                     join d in db.FDOCUMENTOTRIBUTARIO on c.iddocumento equals d.iddocumento
        //                     where c.idsucursal == suc_codigo
        //                     orderby d.iddocumento descending
        //                     select new FCorrelativoDocumentoSucursal
        //                     {
        //                         idcorrelativo = c.idcorrelativo,
        //                         estado = c.estado,
        //                         documento = d.descripcion,
        //                         serieimpresora = c.serieimpresora,
        //                         inicio = c.inicio,
        //                         fin=c.fin,
        //                         actual=c.actual,
        //                         seriedocumento=c.seriedocumento

        //                     }).ToListAsync();
        //        return query;
        //    }
        //    catch (Exception )
        //    {

        //        return new List<FCorrelativoDocumentoSucursal>();
        //    }

        //}              
        //public async Task<mensajeJson > RegistrarEditarAsync(FCorrelativoDocumentoSucursal obj)
        //{
        //    try
        //    {
        //        var aux = db.FCORRELATIVODOCUMENTOT.Where(x => x.idsucursal == obj.idsucursal && x.iddocumento == obj.iddocumento).FirstOrDefault();
        //        if (obj.idcorrelativo == 0)
        //        {
        //            if ((aux is null))
        //            {
        //                obj.actual = obj.inicio;
        //                db.Add(obj);
        //                await db.SaveChangesAsync();
        //                return (new mensajeJson("ok", obj));
        //            }
        //            else
        //            {
        //                return (new mensajeJson("El registro ya existe", null));
        //            }
        //        }
        //        else
        //        {
        //            if (aux is null)
        //                return (new mensajeJson("Estas intentando actualizar un registro que no ha sido creado", null));
        //            else if (aux.idcorrelativo == obj.idcorrelativo)
        //            {
        //                if (obj.inicio > aux.actual)
        //                    obj.actual = obj.inicio;
        //                else if (obj.inicio == aux.inicio)
        //                    obj.actual = aux.actual;
        //                else if (obj.inicio < aux.actual && obj.seriedocumento == aux.seriedocumento)
        //                    return (new mensajeJson("El correlativo de inicio es menor al ultimo correlativo, pueden generarse conflictos al crear los registros.", null));//no puedo actualizar un registro con inicio menor al actual cuando ya han habido operaciones con esa serie
        //                else
        //                    obj.actual = obj.inicio;

        //                db.Update(obj);
        //                await db.SaveChangesAsync();
        //                return (new mensajeJson("ok", obj));

        //            }
        //            else
        //                return (new mensajeJson("El registro ya existe", null));
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return (new mensajeJson(e.Message, null));
        //    }
        //}

        //public async Task<mensajeJson> EliminarAsync(int? id)
        //{
        //    var obj = await db.FCORRELATIVODOCUMENTOT.FirstOrDefaultAsync(m => m.idcorrelativo == id);
        //    var documento = await db.FDOCUMENTOTRIBUTARIO.Where(x => x.iddocumento == obj.iddocumento).FirstOrDefaultAsync();
        //    obj.documento = documento.descripcion;
        //    obj.estado = "DESHABILITADO";
        //    db.Update(obj);
        //    await db.SaveChangesAsync();
        //    return (new mensajeJson("ok", obj));
        //}
        //public async Task<mensajeJson> BuscarAsync(int id)
        //{
        //    try
        //    {
        //        var data = await db.FCORRELATIVODOCUMENTOT.FindAsync(id);
        //        return new mensajeJson("ok", data);
        //    }
        //    catch (Exception e )
        //    {
        //        return new mensajeJson(e.Message,null);
        //    }
        //}


        //public async Task<mensajeJson  > HabilitarAsync(int? id)
        //{
        //    var obj = await db.FCORRELATIVODOCUMENTOT.FirstOrDefaultAsync(m => m.idcorrelativo == id);
        //    var documento = await db.FDOCUMENTOTRIBUTARIO.Where(x => x.iddocumento == obj.iddocumento).FirstOrDefaultAsync();
        //    obj.documento = documento.descripcion;
        //    obj.estado = "HABILITADO";
        //    db.Update(obj);
        //    await db.SaveChangesAsync();
        //    return (new mensajeJson("ok", obj));

        //}

        //public FDocumentoTributario BuscarDocumento(string id)
        //{
        //    var data = db.FDOCUMENTOTRIBUTARIO.Find(id);
        //    return (data);
        //}
        //public async Task<FCorrelativoDocumentoSucursal> BuscarDocumentoyCorrelativoAsync(FCorrelativoDocumentoSucursal obj)
        //{
        //    var data = await db.FCORRELATIVODOCUMENTOT.Where(x => x.idsucursal == obj.idsucursal && x.iddocumento == obj.iddocumento).FirstOrDefaultAsync();
        //    return (data);
        //}

    }
}
