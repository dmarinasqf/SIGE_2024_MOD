using ENTIDADES.compras;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class OrdenCompraEF:IOrdenCompraEF
    {
        private readonly Modelo db;                
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;
        public OrdenCompraEF(Modelo context, IUser _user, UserManager<AppUser> userManager)
        {
            db = context;
            user = _user;
            Appuser = userManager;
        }              
        public async Task<mensajeJson> RegistrarEditarAsync(COrdenCompra orden)
        {
            if (orden.idordencompra is 0)
            {
                orden.idempresa = user.getIdEmpresaCookie();
                orden.idsucursal = user.getIdSucursalCookie();
                return await RegistrarOrden(orden);
            }
            else
                return await EditarOrden(orden);
           
           
        }

        private async Task<mensajeJson> EditarOrden(COrdenCompra orden)
        {
            try
            {
                var aux = await db.CORDENCOMPRA.FindAsync(orden.idordencompra);
                if (aux.estado == "PENDIENTE" || aux.estado == "VENCIDO")
                {
                    if (aux.estado == "VENCIDO") orden.estado = "PENDIENTE";
                    orden.fecha = DateTime.Now;
                    orden.idcontacto = aux.idcontacto;
                    orden.idrepresentante = aux.idrepresentante;
                    orden.emp_codigo = aux.emp_codigo;
                    orden.ano = aux.ano;
                    orden.idsucursal = aux.idsucursal;
                    orden.percepcion = orden.percepcion;
                    db.CORDENCOMPRA.Update(orden);
                    await db.SaveChangesAsync();

                    var detalleCotiParam = JsonConvert.DeserializeObject<List<CCotizacionDetalle>>(orden.jsondetalle);
                    for (int i = 0; i < detalleCotiParam.Count; i++)
                    {
                        var oDetalleOrden = db.CORDENCOMPRADETALLE.Where(x => x.iddetallecotizacion == detalleCotiParam[i].iddetallecotizacion).FirstOrDefault();
                        if (oDetalleOrden != null || oDetalleOrden is not null)
                        {
                            if (detalleCotiParam[i].estado == "DESHABILITADO")
                            {
                                oDetalleOrden.estado = "DESHABILITADO";
                                db.Update(oDetalleOrden);
                                await db.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            COrdenDetalle oDetalle = new COrdenDetalle();
                            oDetalle.estado = "HABILITADO";
                            oDetalle.idordencompra = orden.idordencompra;
                            oDetalle.iddetallecotizacion = detalleCotiParam[i].iddetallecotizacion;
                            await db.AddAsync(oDetalle);
                            await db.SaveChangesAsync();
                        }
                    }

                    return (new mensajeJson("ok", null));
                }
                return (new mensajeJson("La orden no se puede editar porque esta " + aux.estado, null));

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }

        private async Task<mensajeJson> RegistrarOrden(COrdenCompra orden)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    orden.emp_codigo = int.Parse(user.getIdUserSession());
                    if (orden.idempresa is 0)
                        orden.idempresa = user.getIdEmpresaCookie();
                    string codigo = generarcodigo();
                    orden.codigoorden = codigo;
                    orden.fecha = DateTime.Now;
                    orden.ano = DateTime.Now.Year;
                    orden.idsucursal = user.getIdSucursalCookie();
                    if (orden.idsucursal is 0)
                        return (new mensajeJson("Inicie sesion nuevamente", null));
                    if (orden.idcontacto == 0)
                        orden.idcontacto = null;
                    if (orden.idrepresentante == 0)
                        orden.idrepresentante = null;
                    await db.CORDENCOMPRA.AddAsync(orden);
                    await db.SaveChangesAsync();

                    var detalle = JsonConvert.DeserializeObject<List<COrdenDetalle>>(orden.jsondetalle);
                    //for (int i = 0; i < detalle.Count; i++)
                    //{
                    //    detalle[i].idordencompra = orden.idordencompra;
                    //}
                    int _iddetallecotizacion = detalle[0].iddetallecotizacion;
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        detalle[i].idordencompra = orden.idordencompra;
                        //if (i > 0)
                        //{
                        //    //_iddetallecotizacion = _iddetallecotizacion + 1;
                        //    detalle[i].iddetallecotizacion = _iddetallecotizacion + i;
                        //}
                    }
                    await db.CORDENCOMPRADETALLE.AddRangeAsync(detalle);
                    await db.SaveChangesAsync();
                    transaccion.Commit();
                    return (new mensajeJson("ok", orden));
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
       
        public async Task<mensajeJson> EditarDetalleAsync(int[] detalle)
        {
            try
            {
                foreach (var item in detalle)
                {
                    var aux = await db.CORDENCOMPRADETALLE.FindAsync(item);
                    aux.estado = "ELIMINADO";
                    db.Update(aux);
                    await db.SaveChangesAsync();
                }
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));

            }
        }

        public async Task<mensajeJson> RegistrarItemPorDiferenciaCantidad(string jsondetalle)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var detalle = JsonConvert.DeserializeObject<List<int[]>>(jsondetalle);
                    if (detalle != null)
                    {
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            var detalleOrden = db.CORDENCOMPRADETALLE.Where(x => x.idordendetalle == detalle[i][0]).FirstOrDefault();
                            if (detalleOrden != null)
                            {
                                var detalleCotizacion = db.CCOTIZACIONDETALLE.Where(x => x.iddetallecotizacion == detalleOrden.iddetallecotizacion).FirstOrDefault();
                                if (detalleCotizacion != null)
                                {
                                    var detallePreIngreso = db.PIPREINGRESODETALLE.Where(x => x.iddetalle == detalle[i][0]).FirstOrDefault();
                                    if (detallePreIngreso != null)
                                    {
                                        detalleCotizacion.cantidad -= detalle[i][1];
                                        db.Update(detalleCotizacion);
                                        db.SaveChanges();

                                        detalleCotizacion.iddetallecotizacion = 0;
                                        detalleCotizacion.cantidad = detalle[i][1];
                                        detalleCotizacion.bonificacion = 0;

                                        decimal? total = detalleCotizacion.pvf * detalleCotizacion.cantidad;
                                        if (detalleCotizacion.des1 is not null) total -= (total * detalleCotizacion.des1);
                                        if (detalleCotizacion.des2 is not null) total -= (total * detalleCotizacion.des2);
                                        if (detalleCotizacion.des3 is not null) total -= (total * detalleCotizacion.des3);

                                        detalleCotizacion.total = Math.Round(Convert.ToDecimal(total), 2);
                                        detalleCotizacion.subtotal = Math.Round(Convert.ToDecimal(detalleCotizacion.total) / Convert.ToDecimal(1.18), 2);
                                        detalleCotizacion.costo = Math.Round(Convert.ToDecimal(detalleCotizacion.total / detalleCotizacion.cantidad), 2);
                                        detalleCotizacion.montofacturar = detalleCotizacion.costo;
                                        await db.AddAsync(detalleCotizacion);
                                        await db.SaveChangesAsync();

                                        detalleOrden.idordendetalle = 0;
                                        detalleOrden.iddetallecotizacion = detalleCotizacion.iddetallecotizacion;
                                        await db.AddAsync(detalleOrden);
                                        await db.SaveChangesAsync();

                                        detallePreIngreso.cantoc -= detalle[i][1];
                                        db.Update(detallePreIngreso);
                                        db.SaveChanges();

                                        detallePreIngreso.iddetallepreingreso = 0;
                                        detallePreIngreso.idcotizacionbonfi = detalleCotizacion.iddetallecotizacion;
                                        detallePreIngreso.iddetalle = detalleOrden.idordendetalle;
                                        detallePreIngreso.cantfactura = null;
                                        detallePreIngreso.cantingresada = null;
                                        detallePreIngreso.cantdevuelta = null;
                                        detallePreIngreso.idfactura = null;
                                        detallePreIngreso.ordenItemsAprobarFactura = null;
                                        detallePreIngreso.costo = 0;
                                        detallePreIngreso.costoigv = 0;
                                        detallePreIngreso.fechacreacion = DateTime.Now;
                                        detallePreIngreso.fechaedicion = DateTime.Now;
                                        detallePreIngreso.cantoc = detalle[i][1];
                                        await db.AddAsync(detallePreIngreso);
                                        await db.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                    }

                    transaccion.Commit();
                    return new mensajeJson("ok", null);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        public async Task<mensajeJson> AnularOrdenAsync(int id)
        {
            try
            {
                var cotizacion = await db.CORDENCOMPRA.FindAsync(id);
                if (cotizacion != null)
                {
                    //var detalle = await db.CCOTIZACIONDETALLE.Where(x => x.idcotizacion == id && x.estado != "ELIMINADO").ToListAsync();
                    cotizacion.estado = "ANULADO";
                    db.CORDENCOMPRA.Update(cotizacion);
                    await db.SaveChangesAsync();
                    //foreach (var item in detalle)
                    //{
                    //    item.estado = "ANULADO";
                    //}
                    //db.CCOTIZACIONDETALLE.UpdateRange(detalle);
                    //await db.SaveChangesAsync();
                    return (new mensajeJson("ok", null));
                }
                return (new mensajeJson("No existe cotizacion", null));

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }                      
       
        public async Task<mensajeJson> AprobarOCAsync(COrdenCompra obj)
        {
            try
            {
                var aux = db.CORDENCOMPRA.Find(obj.idordencompra);
                if (aux != null)
                {
                    aux.usuarioaprueba = obj.usuarioaprueba;
                    aux.fechaaprobacion = DateTime.Now;
                    aux.estado = "APROBADO";
                    db.CORDENCOMPRA.Update(aux);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                {
                    return (new mensajeJson("No se encontró la Orden de Compra", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
      
        public async Task<OrdenCompraModel> datosiniciocotizacionAsync()
        {
            OrdenCompraModel model = new OrdenCompraModel();
            model.icoterms = await db.FICOTERMS.Where(x => x.estado == "HABILITADO").ToListAsync();
            model.monedas = await db.FMONEDA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.nombre).ToListAsync();
            model.condicionpago = await db.CCONDICIONPAGO.Where(x => x.estado =="HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.tipopago = await db.FTIPOPAGO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.idalmacensucursal = db.EMPRESA.Find(user.getIdEmpresaCookie()).idsucursalalmacen;
            var sucursales = await (from s in db.SUCURSAL
                                    where s.estado != "DESHABILITADO" && s.estado != "ELIMINADO"
                                    && s.idempresa == user.getIdEmpresaCookie()
                                    orderby s.descripcion
                                    select new SUCURSAL
                                    {
                                        descripcion = s.descripcion,
                                        suc_codigo = s.suc_codigo
                                    }).ToListAsync();
            model.sucursales = sucursales;
            var IGV = await db.CCONSTANTE.FindAsync("IGV");
            var PERCEPCION = await db.CCONSTANTE.FindAsync("PERCEPCION");
            model.IGV = IGV.valor.Replace(",", ".");
            model.PERCEPCION = PERCEPCION.valor.Replace(",", ".");
            return model;

        }
        public async Task<mensajeJson> VerificarCredenciales_OrdenCompraAsync(string usuario, string clave)
        {
            try
            {
                var empleado = db.EMPLEADO.Where(x => x.userName == usuario && x.clave == clave && x.estado != "ELIMINADO").FirstOrDefault();
                if (empleado == null)
                    return (new mensajeJson("Credenciales incorrectas", null));
                else
                {
                    var usuarios = await Appuser.FindByIdAsync(empleado.emp_codigo.ToString());
                    if(usuarios is null)
                        return (new mensajeJson("Credenciales incorrectas", null));

                    if (await Appuser.IsInRoleAsync(usuarios, "APROBAR ORDEN DE COMPRA") || await Appuser.IsInRoleAsync(usuarios, "ADMINISTRADOR"))
                    {
                        return (new mensajeJson("ok", empleado.emp_codigo.ToString()));
                    }
                    else
                    {
                        return (new mensajeJson("ntp", null));
                    }
                }

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        private string generarcodigo()
        {
            int empresa =( user.getIdEmpresaCookie());
            string correlativoempresa = db.EMPRESA.Find(empresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.CORDENCOMPRA.Where(X => X.idempresa == empresa && X.ano == ano).Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = "OR" + correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
    }
}
