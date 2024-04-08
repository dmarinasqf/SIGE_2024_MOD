using ENTIDADES.compras;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class RequerimientoEF : IRequerimientoEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        public RequerimientoEF(Modelo _db, IUser _user)
        {
            db = _db;
            user = _user;
        }

        public async Task<mensajeJson> RegistrarEditarAsync(CRequerimiento oRequerimiento)
        {
            if (oRequerimiento.idrequerimiento is 0)
            {
                return await RegistrarAsync(oRequerimiento);
            }
            else
                return await EditarAsync(oRequerimiento);
        }

        public async Task<mensajeJson> RegistrarAsync(CRequerimiento oRequerimiento)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    oRequerimiento.estado = "HABILITADO";
                    oRequerimiento.emp_codigo = Convert.ToInt32(user.getIdUserSession());
                    db.CREQUERIMIENTO.Add(oRequerimiento);
                    db.SaveChanges();
                    var lRequerimientoDetalle = JsonConvert.DeserializeObject<List<CRequerimientoDetalle>>(oRequerimiento.jsondetalle);
                    foreach (var item in lRequerimientoDetalle)
                    {
                        item.idrequerimiento = oRequerimiento.idrequerimiento;
                        item.estado = "HABILITADO";
                    }
                    await db.CREQUERIMIENTODETALLE.AddRangeAsync(lRequerimientoDetalle);
                    await db.SaveChangesAsync();
                    transaccion.Commit();
                    return new mensajeJson("ok", oRequerimiento);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return new mensajeJson(e.Message + " -> " + error, null);
                }
            }

        }
        public async Task<mensajeJson> EditarAsync(CRequerimiento oRequerimiento)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    oRequerimiento.estado = "HABILITADO";
                    oRequerimiento.emp_codigo = Convert.ToInt32(user.getIdUserSession());
                    db.CREQUERIMIENTO.Update(oRequerimiento);
                    db.SaveChanges();

                    var lRequerimientoDetalleParam = JsonConvert.DeserializeObject<List<CRequerimientoDetalle>>(oRequerimiento.jsondetalle);
                    var oListaDetalleRequerimiento = db.CREQUERIMIENTODETALLE.Where(x => x.idrequerimiento == oRequerimiento.idrequerimiento && x.estado == "HABILITADO").ToList();
                    for (int i = 0; i < oListaDetalleRequerimiento.Count; i++)
                    {
                        var oRequerimientoDetalleParam = lRequerimientoDetalleParam.Where(x => x.idproducto == oListaDetalleRequerimiento[i].idproducto).FirstOrDefault();
                        if (oRequerimientoDetalleParam != null || oRequerimientoDetalleParam is not null)
                        {
                            oListaDetalleRequerimiento[i].cantidad = oRequerimientoDetalleParam.cantidad;
                            oRequerimientoDetalleParam.idrequerimientodetalle = oListaDetalleRequerimiento[i].idrequerimientodetalle;
                        }
                        else
                        {
                            oListaDetalleRequerimiento[i].estado = "DESHABILITADO";
                        }
                        db.CREQUERIMIENTODETALLE.Update(oListaDetalleRequerimiento[i]);
                        db.SaveChanges();
                    }

                    for (int i = 0; i < lRequerimientoDetalleParam.Count; i++)
                    {
                        if (lRequerimientoDetalleParam[i].idrequerimientodetalle == 0)
                        {
                            lRequerimientoDetalleParam[i].idrequerimiento = oRequerimiento.idrequerimiento;
                            lRequerimientoDetalleParam[i].estado = "HABILITADO";
                            await db.AddAsync(lRequerimientoDetalleParam[i]);
                            await db.SaveChangesAsync();
                        }
                    }

                    transaccion.Commit();
                    return new mensajeJson("ok", oRequerimiento);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return new mensajeJson(e.Message + " -> " + error, null);
                }
            }

        }

        public async Task<mensajeJson> EditarIdOrdenEnRequerimiento(int idrequerimiento, int idordencompra)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var oRequerimiento = db.CREQUERIMIENTO.Where(x => x.idrequerimiento == idrequerimiento).FirstOrDefault();
                    if (oRequerimiento != null || oRequerimiento is not null)
                    {
                        oRequerimiento.idordencompra = idordencompra;
                        db.Update(oRequerimiento);
                        await db.SaveChangesAsync();
                    }
                    transaccion.Commit();
                    return new mensajeJson("ok", oRequerimiento);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return new mensajeJson(e.Message + " -> " + error, null);
                }
            }

        }
    }
}
