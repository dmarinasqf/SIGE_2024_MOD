using ENTIDADES.preingreso;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
   public class GuiaDevolucionEF: IGuiaDevolucionEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;
        public GuiaDevolucionEF(Modelo context, IUser _user, UserManager<AppUser> Appuser_)
        {
            db = context;
            user = _user;
            Appuser = Appuser_;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(PIGuiaDevolucion obj)
        {
         
            if (obj.idguia is 0)
                return await RegistrarAsync(obj);
            else
                return await EditarAsync(obj);

        }

        private async Task<mensajeJson> EditarAsync(PIGuiaDevolucion obj)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var detalle = JsonConvert.DeserializeObject<List<PIGuiaDevolucionDetalle>>(obj.jsondetalle);
                    var objaux = db.PIGUIADEVOLUCION.Find(obj.idguia);
                    objaux.observacion = obj.observacion;
                    db.Update(objaux);
                    db.SaveChanges();
                    detalle.ForEach(x => x.idguia = objaux.idguia);
                    detalle.ForEach(x => x.estado = "HABILITADO");
                    var listanueva = detalle.Where(x => x.iddetalle == 0).ToList();
                    var listaedicion = detalle.Where(x => x.iddetalle != 0).ToList();
                    if(listanueva.Count>0)
                    {
                        db.AddRange(listanueva);
                        db.SaveChanges();
                    }
                    if(listaedicion.Count>0)
                    {
                        db.UpdateRange(listaedicion);
                        db.SaveChanges();
                    }
                                        
                    transaccion.Commit();
                    return new mensajeJson("ok", objaux);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);

                }

            }
           

        }

        private async Task<mensajeJson> RegistrarAsync(PIGuiaDevolucion obj)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var numdocumento = "";
                    var cajasucursal = db.CAJASUCURSAL.Find(obj.idcajasucursal);
                    if (cajasucursal is null)
                        return new mensajeJson("El sucursal no tiene correlativo para guía de devolución", null);
                    var correlativo = db.CORRELATIVODOCUMENTO.Where(x => x.estado == "HABILITADO" && x.idcajasucursal == obj.idcajasucursal && x.iddocumento == obj.iddocumento).FirstOrDefault();
                    if (correlativo is null)
                        return new mensajeJson("El sucursal no tiene correlativo para guía de devolución", null);
                    AgregarCeros ceros = new AgregarCeros();

                    var numregistros = db.CORRELATIVODOCUMENTO.Where(x => x.estado == "HABILITADO" && x.idcajasucursal == obj.idcajasucursal && x.iddocumento==obj.iddocumento).FirstOrDefault();
                        //db.PIGUIADEVOLUCION.Where(x => x.idsucursal == obj.idsucursal).ToList().Count;
                    numdocumento = correlativo.serie + ceros.agregarCeros(Convert.ToInt32(numregistros.actual)+1);


                    var detalle = JsonConvert.DeserializeObject<List<PIGuiaDevolucionDetalle>>(obj.jsondetalle);
                    obj.fecha = DateTime.Now;
                    obj.estado = "HABILITADO";
                    obj.tipo = "01";
                    obj.numeroguia = numdocumento;
                    db.PIGUIADEVOLUCION.Add(obj);
                    db.SaveChanges();
                    detalle.ForEach(x => x.idguia = obj.idguia);
                    detalle.ForEach(x => x.estado = "HABILITADO");
                    db.AddRange(detalle);
                    db.SaveChanges();
                    transaccion.Commit();
                    return new mensajeJson("ok", obj);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);

                }

            }

        }
    }
}
