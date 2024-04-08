using DocumentFormat.OpenXml.Presentation;
using ENTIDADES.Almacen;
using ENTIDADES.preingreso;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
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

namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
   public class BonificacionFueraDocumentoEF: IBonificacionFueraDocumentoEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;
        public BonificacionFueraDocumentoEF(Modelo context, IUser _user, UserManager<AppUser> Appuser_)
        {
            db = context;
            user = _user;
            Appuser = Appuser_;
        }

        public mensajeJson RegistrarEditar(List<PIDetalleBonificacionFueraDocumento> bonificacion,string cmm)
        {
            //if (bonificacion.id is 0)
                return Registrar(bonificacion,cmm);
            //else
            //    return new mensajeJson("ok", null);
        }

        private mensajeJson Registrar(List< PIDetalleBonificacionFueraDocumento> bonificacion,string cmm)
        {
            using (var transaccion= db.Database.BeginTransaction())
            {
                try
                {                   
                    PreingresoDAO dao = new PreingresoDAO(cmm);
                    List<AStockLoteProducto> listaedicion_stock = new List<AStockLoteProducto>();
                    List<AStockLoteProducto> listanuevo_stock = new List<AStockLoteProducto>();
                    for (int i = 0; i < bonificacion.Count; i++)
                    {
                        bonificacion[i].estado = "HABILITADO";                                          
                        db.Add(bonificacion[i]);
                        db.SaveChanges();
                        var obj = bonificacion[i];
                        var data = db.ASTOCKPRODUCTOLOTE.Where(x => x.idproducto == obj.idproducto
                          && x.candisponible > 0 && x.lote == obj.lote
                          && x.fechavencimiento == obj.fechavencimiento).ToList();
                        if(data.Count>0)
                        {
                            var stock = db.ASTOCKPRODUCTOLOTE.Find(data[0].idstock);
                            var cantidadingreso = (obj.cantidadingresada * stock.multiplo ?? 1);
                            stock.candisponible += cantidadingreso;
                            stock.caningreso += cantidadingreso;
                            stock.edicion = stock.setedicion("INGRESO", "DetalleBonificacionFueraDocumento", bonificacion[i].id.ToString(), cantidadingreso.ToString());
                            listaedicion_stock.Add(stock);
                           
                        }
                        else
                        {
                            return new mensajeJson("No se encontro stock con los datos del lote ingresado para el item " + (i + 1), null);

                        }
                    }
                    if(listaedicion_stock.Count>0)
                    {
                        db.UpdateRange(listaedicion_stock);
                        db.SaveChanges();
                    }
                    
                    transaccion.Commit();
                    return new mensajeJson("ok", bonificacion);

                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message,null);
                }
            }
        }
    }
}
