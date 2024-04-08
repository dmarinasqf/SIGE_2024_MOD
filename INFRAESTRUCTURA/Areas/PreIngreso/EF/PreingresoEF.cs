using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.ViewModel;
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
using Google.Apis.Drive.v3;
using System.Net.Http;
using System.IO;
using Google.Apis.Auth.OAuth2;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
// usign drive
using Microsoft.AspNetCore.Hosting;
namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
    public class PreingresoEF : IPreingresoEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;
        private readonly ICotizacionEF cotizacionEF;
      
        // controler para subir el archivo al drive yex
        private static string refreshToken = "1//04WFayheN3yhVCgYIARAAGAQSNwF-L9IrzJ2YgTZ3IKTAxbY0tE5H2V0IRAlua8OEcGNQ4qS_h2L9SHAxNcjNJOiDbXceVMv3j8g"; // Asegúrate de almacenar esto de manera segura
        private static string accessToken = "ya29.a0AfB_byA3v_u4ikvUSL6_d2ox-kuZ7pb01LMXzkJzzLoS8tnkfwgDItLf3VwYyjvJURUbgB4dmGPfLAIPI_efftppQrNPZ_9ndaCaN4wppmbgsr8GowGpfWYSSi1qdOHHsC4wTJ96Z0COwH_1IY-TaQ6TM9qRoAgXS27jaCgYKAekSARESFQHGX2Mi3yk2aI8rruEEsdK_F-nlYw0171"; // Asegúrate de almacenar esto de manera segura
        private static DateTime expirationDateTime; // Debes inicializar esta variable cuando obtengas el token de acceso

        public PreingresoEF(Modelo context, IUser _user,UserManager<AppUser> Appuser_)
        {
            db = context;
            user = _user;
            Appuser = Appuser_;
     
        }

        public async Task<mensajeJson> RegistrarEditarAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal, int idsucusal,string rutadoc)
        {
            
            var compra = db.CORDENCOMPRA.Find(preingreso.idordencompra);
            if (compra.idsucursaldestino != user.getIdSucursalCookie())
                return new mensajeJson("La orden de compra ha sido asignada a otra sucursal", null);
            if (preingreso.idpreingreso is 0)
            {
                if (preingreso.iddocumento == 1000)
                    return await RegistrarAsync(preingreso, lAlmacenSucursal,idsucusal,rutadoc);
                else if (preingreso.iddocumento == 1004)
                    return await RegistrarGuiaAsync(preingreso, lAlmacenSucursal);
                else
                    return new mensajeJson("Excepcion", null);
            }
            else
            {
                if (preingreso.iddocumento == 1000)
                    return await EditarAsync(preingreso, lAlmacenSucursal);
                else if (preingreso.iddocumento == 1004)
                    return await EditarGuiaAsync(preingreso, lAlmacenSucursal);
                else
                    return new mensajeJson("Excepcion", null);
            }

        }

        private async Task<mensajeJson> EditarAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal)
        {
            //GUARDAR PREINGRESO
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var aux = await db.PIPREINGRESO.FindAsync(preingreso.idpreingreso);
                    //preingreso.idempresa = aux.idempresa;
                    //preingreso.fecha = aux.fecha;
                    //preingreso.idsucursal = aux.idsucursal;
                    //preingreso.idempleado = aux.idempleado;
                    //preingreso.ano = aux.ano;
                    var USER = await Appuser.FindByIdAsync(user.getIdUserSession());
                    if (aux.estado == "PENDIENTE" || await Appuser.IsInRoleAsync(USER, "ADMINISTRADOR"))
                    {
                        aux.observacion = preingreso.observacion;
                        aux.obs = preingreso.obs;
                        aux.rechazadoporerror = preingreso.rechazadoporerror;
                        aux.estado = preingreso.estado;
                        aux.idalmacensucursal = preingreso.idalmacensucursal;
                        aux.estado = preingreso.estado;

                        db.PIPREINGRESO.Update(aux);
                        await db.SaveChangesAsync();

                        var detalle = JsonConvert.DeserializeObject<List<PIPreingresoDetalle>>(preingreso.jsondetalle);
                        var factura = db.PIFACTURASPREINGRESO.Where(x => x.serie == preingreso.seriedoc && x.numdoc == preingreso.numerodoc && x.idpreingreso == preingreso.idpreingreso).FirstOrDefault();
                        //var factura2 = factura;

                        List<PIPreingresoDetalle> detalleSinFactura = new List<PIPreingresoDetalle>();
                        foreach(var item in detalle)
                        {
                            if (item.idfactura < 1 || item.idfactura is null || item.idfactura == null)
                            {
                                detalleSinFactura.Add(item);
                            }
                        }
                        detalle = detalleSinFactura;

                        if (factura != null)
                        {
                            if (factura.estado == "HABILITADO" || factura.estado == "APROBADO")
                            {
                                transaccion.Rollback();
                                return new mensajeJson($"No se puede guardar, porque la factura esta {factura.estado} ", null);
                            }
                        }

                        factura = new PIFacturaPreingreso
                        {
                            idpreingreso = preingreso.idpreingreso,
                            estado = "HABILITADO",
                            serie = preingreso.seriedoc,
                            numdoc = preingreso.numerodoc,
                            fecha = preingreso.fechadoc,
                            iddocumento = preingreso.iddocumento,
                            idproveedor = preingreso.idproveedor
                        };
                        await db.PIFACTURASPREINGRESO.AddAsync(factura);
                        await db.SaveChangesAsync();

                        //if (factura is null || factura.estado == "ANULADO" || factura.estado == "DESHABILITADO")
                        //{
                        //    factura = new PIFacturaPreingreso
                        //    {
                        //        idpreingreso = preingreso.idpreingreso,
                        //        estado = "HABILITADO",
                        //        serie = preingreso.seriedoc,
                        //        numdoc = preingreso.numerodoc,
                        //        fecha = preingreso.fechadoc,
                        //        iddocumento = preingreso.iddocumento
                        //    };
                        //    await db.PIFACTURASPREINGRESO.AddAsync(factura);
                        //    await db.SaveChangesAsync();
                        //}
                        //if (factura2 != null && (factura2.estado != "ANULADO" || factura2.estado != "DESHABILITADO"))
                        //{
                        //    transaccion.Rollback();
                        //    return new mensajeJson($"No se puede guardar, porque la factura esta {factura.estado} ",null);
                        //}
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            if (detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                            {
                                if (detalle[i].iddetalle == 0 || detalle[i].idcotizacionbonfi == 0 ||
                                    detalle[i].iddetalle == null || detalle[i].idcotizacionbonfi == null ||
                                    detalle[i].iddetalle is null || detalle[i].idcotizacionbonfi is null)
                                {
                                    detalle[i].cantoc = detalle[i].cantfactura;
                                    var filtroItem = detalle.Where(x => x.idcotizacionbonfi > 0).FirstOrDefault();
                                    var cualquierItemDetalleCotizacion = db.CCOTIZACIONDETALLE.Find(filtroItem.idcotizacionbonfi);
                                    CCotizacionDetalle obj_cotizacionDetalle = new CCotizacionDetalle();
                                    obj_cotizacionDetalle.idcotizacion = cualquierItemDetalleCotizacion.idcotizacion;
                                    obj_cotizacionDetalle.idproducto = detalle[i].idproducto;
                                    obj_cotizacionDetalle.cantidad = (int)detalle[i].cantfactura;
                                    obj_cotizacionDetalle.pvf = 0;
                                    obj_cotizacionDetalle.des1 = 0;
                                    obj_cotizacionDetalle.des2 = 0;
                                    obj_cotizacionDetalle.des3 = 0;
                                    obj_cotizacionDetalle.costo = 0;
                                    obj_cotizacionDetalle.total = 0;
                                    obj_cotizacionDetalle.vvf = 0;
                                    obj_cotizacionDetalle.subtotal = 0;
                                    obj_cotizacionDetalle.estado = "HABILITADO";
                                    obj_cotizacionDetalle.montofacturar = 0;
                                    db.CCOTIZACIONDETALLE.Add(obj_cotizacionDetalle);
                                    db.SaveChanges();

                                    if (obj_cotizacionDetalle.iddetallecotizacion > 0)
                                    {
                                        var cualquierItemDetalleOrdenCompra = db.CORDENCOMPRADETALLE.Where(x => x.iddetallecotizacion == cualquierItemDetalleCotizacion.iddetallecotizacion).FirstOrDefault();
                                        COrdenDetalle obj_ordenDetalle = new COrdenDetalle();
                                        obj_ordenDetalle.idordencompra = cualquierItemDetalleOrdenCompra.idordencompra;
                                        obj_ordenDetalle.iddetallecotizacion = obj_cotizacionDetalle.iddetallecotizacion;
                                        obj_ordenDetalle.estado = "HABILITADO";
                                        db.CORDENCOMPRADETALLE.Add(obj_ordenDetalle);
                                        db.SaveChanges();

                                        if (obj_ordenDetalle.idordendetalle > 0)
                                        {
                                            detalle[i].idcotizacionbonfi = obj_cotizacionDetalle.iddetallecotizacion;
                                            detalle[i].iddetalle = obj_ordenDetalle.idordendetalle;
                                        }
                                        else
                                        {
                                            transaccion.Rollback();
                                            return (new mensajeJson("Error al guardar el Item Devolución: Proceso OrdenCompraDetalle.", null));
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return (new mensajeJson("Error al guardar el Item Devolución: Proceso CotizacionDetalle.", null));
                                    }
                                }
                            }

                            if (detalle[i].tipo.Contains("BONIFICACION"))
                            {
                                if (detalle[i].iddetalle is null || detalle[i].iddetalle == 0 || detalle[i].iddetalle == null)
                                {
                                    var precioBonificacion = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).Select(x => x.pvf).FirstOrDefault() ?? 0;
                                    CBonificacionCotizacion oBonificacionCotizacion = new CBonificacionCotizacion();
                                    oBonificacionCotizacion.iddetallecotizacion = detalle[i].iddetallecotizacionbonificacion;
                                    oBonificacionCotizacion.cantidad = (int)detalle[i].cantfactura;
                                    oBonificacionCotizacion.precio = precioBonificacion;
                                    oBonificacionCotizacion.estado = "HABILITADO";
                                    oBonificacionCotizacion.idproducto = detalle[i].idproducto;
                                    oBonificacionCotizacion.tipo = detalle[i].tipo.Split(' ')[1];
                                    db.CBONIFICACIONCOTIZACION.Add(oBonificacionCotizacion);
                                    db.SaveChanges();

                                    detalle[i].iddetalle = oBonificacionCotizacion.idbonificacion;
                                    detalle[i].idcotizacionbonfi = detalle[i].iddetallecotizacionbonificacion;

                                    CCotizacionDetalle oDetalleCotizacion = new CCotizacionDetalle();
                                    oDetalleCotizacion = db.CCOTIZACIONDETALLE.Where(x => x.iddetallecotizacion == detalle[i].iddetallecotizacionbonificacion).FirstOrDefault();

                                    if (oBonificacionCotizacion.tipo == "AFECTO")
                                    {
                                        if (oDetalleCotizacion.idproducto == detalle[i].idproducto)
                                        {
                                            var nuevoCosto = oDetalleCotizacion.total / (oDetalleCotizacion.cantidad + detalle[i].cantingresada);
                                            oDetalleCotizacion.costo = nuevoCosto;
                                            oDetalleCotizacion.montofacturar = nuevoCosto;
                                        }
                                        else
                                        {
                                            var nuevoTotal = oDetalleCotizacion.total - precioBonificacion;
                                            oDetalleCotizacion.total = nuevoTotal;
                                            oDetalleCotizacion.subtotal = (decimal?)Math.Round(Convert.ToDecimal(nuevoTotal / Convert.ToDecimal(1.18)), 2);
                                            var nuevoCosto = nuevoTotal / oDetalleCotizacion.cantidad;
                                            oDetalleCotizacion.costo = nuevoCosto;
                                            oDetalleCotizacion.montofacturar = nuevoCosto;
                                        }
                                    }

                                    oDetalleCotizacion.bonificacion = precioBonificacion;
                                    db.CCOTIZACIONDETALLE.Update(oDetalleCotizacion);
                                    db.SaveChanges();
                                }
                            }

                            detalle[i].idpreingreso = preingreso.idpreingreso;
                            if (detalle[i].tipo.Contains("ORDENCOMPRA") || detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                                detalle[i].tabla = "DetalleOrdenCompra";
                            else if (detalle[i].tipo.Contains("BONIFICACION"))
                                detalle[i].tabla = "BonificacionCotizacion";
                            //registro la factura al detalle si la cantidad es mayor a 0
                            if (detalle[i].idfactura is null || detalle[i].idfactura is 0)
                                //if (detalle[i].cantingresada > 0 || detalle[i].cantdevuelta > 0)
                                if (detalle[i].cantingresada != null || detalle[i].cantdevuelta != null)
                                    detalle[i].idfactura = factura.idfactura;

                        }
                        db.PIPREINGRESODETALLE.UpdateRange(detalle);
                        await db.SaveChangesAsync();

                        //EDITAR ESTADO DE OC
                        var estado = getestadoorden(detalle);
                        var oc = db.CORDENCOMPRA.Find(aux.idordencompra);
                        if (estado != oc.estado)
                        {
                            oc.estado = estado;
                            db.Update(oc);
                            await db.SaveChangesAsync();
                        }
                        //if (oc.estado == "COMPRA COMPLETADA" && preingreso.estado == "PENDIENTE")
                        //{
                        //    preingreso.estado = "TERMINADO";
                        //    db.Update(preingreso);
                        //    db.SaveChanges();
                        //}

                        List<PIPreingresoDetalle> lDetallePI = new();
                        foreach (var item in detalle)
                        {
                            var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                            if (objProducto.idtipoproducto != "EC" && objProducto.idtipoproducto != "SV")
                            {
                                lDetallePI.Add(item);
                            }
                        }

                        List<PILote> lotes = new List<PILote>();
                        List<PILote> lotessave = new List<PILote>();

                        //guardar lotes
                        foreach (var item in lDetallePI)
                        {
                            lotes = db.PILOTE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso && x.estado != "ELIMINADO").ToList();
                            var lotesaux = PrepararLotes(lotes, item.lotes == null ? new List<PILote>() : item.lotes.ToList());

                            if (lotesaux.Count > 0)
                                for (int i = 0; i < lotesaux.Count; i++)
                                {
                                    lotesaux[i].iddetallepreingreso = item.iddetallepreingreso;
                                    lotesaux[i].idproducto = item.idproducto;
                                    if (lotesaux[i].estado != "ELIMINADO")
                                        lotesaux[i].estado = "HABILITADO";
                                }
                            else
                            {
                                if (item.cantingresada != null && item.cantingresada > 0)
                                {
                                    var auxloteobj = new PILote();
                                    auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                    auxloteobj.cantidad = item.cantingresada.Value;
                                    auxloteobj.observacion = "Ingreso por defecto";
                                    auxloteobj.idproducto = item.idproducto;

                                    lotessave.Add(auxloteobj);
                                }
                            }
                            lotessave.AddRange(lotesaux);

                        }
                        if (lotessave.Count > 0)
                        {
                            db.PILOTE.UpdateRange(lotessave);
                            await db.SaveChangesAsync();

                            foreach (var item in lotessave)
                            {
                                var idlotenew = item.idlote;
                                var nombrecarpeta = item.nomcodcarpeta;
                                var nomdocu = item.nomcoddocumento;
                                // subirarchivoapi(nombrecarpeta, nomdocu, idlotenew);

                            }
                        }

                        var resembalaje = await GuardarCondicionEmbalajeAsync(lDetallePI);
                        if (resembalaje != "ok")
                        {
                            transaccion.Rollback();
                            return (new mensajeJson("Error al guardar las condicione de embalaje", null));
                        }

                        List<PILote> lotessavefiltro = new List<PILote>();
                        foreach (var item in lotessave)
                        {
                            var objDetPreIng = db.PIPREINGRESODETALLE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).FirstOrDefault();
                            var objPro = db.APRODUCTO.Where(x => x.idproducto == objDetPreIng.idproducto).FirstOrDefault();
                            if (objPro.idtipoproducto != "IS")
                            {
                                lotessavefiltro.Add(item);
                            }
                        }
                        var respstock = CrearStockPreingresoAsync(lotessavefiltro, preingreso, lAlmacenSucursal);
                        if (respstock == "ok")
                        {
                            transaccion.Commit();
                            return (new mensajeJson("ok", preingreso));

                        }
                        else
                        {
                            transaccion.Rollback();
                            return (new mensajeJson("Error al cargar el stock", null));

                        }
                    }
                    else
                        return new mensajeJson("No se puede editar porque el preingreso esta " + aux.estado, null);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        private async Task<mensajeJson> RegistrarAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal, int idempleado,string rutadoc)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    preingreso.ano = DateTime.Now.Year;
                    preingreso.fecha = DateTime.Now;
                    preingreso.codigopreingreso = await generarcodigoAsync();
                    preingreso.idsucursal = user.getIdSucursalCookie();
                    preingreso.idempresa = user.getIdEmpresaCookie();
                    preingreso.idempleado = int.Parse(user.getIdUserSession());
                    await db.PIPREINGRESO.AddAsync(preingreso);
                    await db.SaveChangesAsync();
                    //REGISTRAR FACTURA DE PREINGRESO
                    var factura = new PIFacturaPreingreso
                    {
                        idpreingreso = preingreso.idpreingreso,
                        estado = "HABILITADO",
                        serie = preingreso.seriedoc,
                        numdoc = preingreso.numerodoc,
                        fecha = preingreso.fechadoc,
                        iddocumento = preingreso.iddocumento,
                        idproveedor = preingreso.idproveedor
                    };
                    await db.PIFACTURASPREINGRESO.AddAsync(factura);
                    await db.SaveChangesAsync();
                    var detalle = JsonConvert.DeserializeObject<List<PIPreingresoDetalle>>(preingreso.jsondetalle);
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        if (detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                        {
                            if (detalle[i].iddetalle == 0 || detalle[i].idcotizacionbonfi == 0 ||
                                detalle[i].iddetalle == null || detalle[i].idcotizacionbonfi == null ||
                                detalle[i].iddetalle is null || detalle[i].idcotizacionbonfi is null)
                            {
                                detalle[i].cantoc = detalle[i].cantfactura;
                                var filtroItem = detalle.Where(x => x.idcotizacionbonfi > 0).FirstOrDefault();
                                var cualquierItemDetalleCotizacion = db.CCOTIZACIONDETALLE.Find(filtroItem.idcotizacionbonfi);
                                CCotizacionDetalle obj_cotizacionDetalle = new CCotizacionDetalle();
                                obj_cotizacionDetalle.idcotizacion = cualquierItemDetalleCotizacion.idcotizacion;
                                obj_cotizacionDetalle.idproducto = detalle[i].idproducto;
                                obj_cotizacionDetalle.cantidad = (int)detalle[i].cantfactura;
                                obj_cotizacionDetalle.pvf = 0;
                                obj_cotizacionDetalle.des1 = 0;
                                obj_cotizacionDetalle.des2 = 0;
                                obj_cotizacionDetalle.des3 = 0;
                                obj_cotizacionDetalle.costo = 0;
                                obj_cotizacionDetalle.total = 0;
                                obj_cotizacionDetalle.vvf = 0;
                                obj_cotizacionDetalle.subtotal = 0;
                                obj_cotizacionDetalle.estado = "HABILITADO";
                                obj_cotizacionDetalle.montofacturar = 0;
                                db.CCOTIZACIONDETALLE.Add(obj_cotizacionDetalle);
                                db.SaveChanges();

                                if (obj_cotizacionDetalle.iddetallecotizacion > 0)
                                {
                                    var cualquierItemDetalleOrdenCompra = db.CORDENCOMPRADETALLE.Where(x => x.iddetallecotizacion == cualquierItemDetalleCotizacion.iddetallecotizacion).FirstOrDefault();
                                    COrdenDetalle obj_ordenDetalle = new COrdenDetalle();
                                    obj_ordenDetalle.idordencompra = cualquierItemDetalleOrdenCompra.idordencompra;
                                    obj_ordenDetalle.iddetallecotizacion = obj_cotizacionDetalle.iddetallecotizacion;
                                    obj_ordenDetalle.estado = "HABILITADO";
                                    db.CORDENCOMPRADETALLE.Add(obj_ordenDetalle);
                                    db.SaveChanges();

                                    if (obj_ordenDetalle.idordendetalle > 0)
                                    {
                                        detalle[i].idcotizacionbonfi = obj_cotizacionDetalle.iddetallecotizacion;
                                        detalle[i].iddetalle = obj_ordenDetalle.idordendetalle;
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return (new mensajeJson("Error al guardar el Item Devolución: Proceso OrdenCompraDetalle.", null));
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return (new mensajeJson("Error al guardar el Item Devolución: Proceso CotizacionDetalle.", null));
                                }
                            }
                        }

                        if (detalle[i].tipo.Contains("BONIFICACION"))
                        {
                            if (detalle[i].iddetalle is null || detalle[i].iddetalle == 0 || detalle[i].iddetalle == null)
                            {
                                var precioBonificacion = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).Select(x => x.pvf).FirstOrDefault() ?? 0;
                                CBonificacionCotizacion oBonificacionCotizacion = new CBonificacionCotizacion();
                                oBonificacionCotizacion.iddetallecotizacion = detalle[i].iddetallecotizacionbonificacion;
                                oBonificacionCotizacion.cantidad = (int)detalle[i].cantfactura;
                                oBonificacionCotizacion.precio = precioBonificacion;
                                oBonificacionCotizacion.estado = "HABILITADO";
                                oBonificacionCotizacion.idproducto = detalle[i].idproducto;
                                oBonificacionCotizacion.tipo = detalle[i].tipo.Split(' ')[1];
                                db.CBONIFICACIONCOTIZACION.Add(oBonificacionCotizacion);
                                db.SaveChanges();

                                detalle[i].iddetalle = oBonificacionCotizacion.idbonificacion;
                                detalle[i].idcotizacionbonfi = detalle[i].iddetallecotizacionbonificacion;

                                CCotizacionDetalle oDetalleCotizacion = new CCotizacionDetalle();
                                oDetalleCotizacion = db.CCOTIZACIONDETALLE.Where(x => x.iddetallecotizacion == detalle[i].iddetallecotizacionbonificacion).FirstOrDefault();

                                if (oBonificacionCotizacion.tipo == "AFECTO")
                                {
                                    if (oDetalleCotizacion.idproducto == detalle[i].idproducto)
                                    {
                                        var nuevoCosto = oDetalleCotizacion.total / (oDetalleCotizacion.cantidad + detalle[i].cantingresada);
                                        oDetalleCotizacion.costo = nuevoCosto;
                                        oDetalleCotizacion.montofacturar = nuevoCosto;
                                    }
                                    else
                                    {
                                        var nuevoTotal = oDetalleCotizacion.total - precioBonificacion;
                                        oDetalleCotizacion.total = nuevoTotal;
                                        oDetalleCotizacion.subtotal = (decimal?)Math.Round(Convert.ToDecimal(nuevoTotal / Convert.ToDecimal(1.18)),2);
                                        var nuevoCosto = nuevoTotal / oDetalleCotizacion.cantidad;
                                        oDetalleCotizacion.costo = nuevoCosto;
                                        oDetalleCotizacion.montofacturar = nuevoCosto;
                                    }
                                }

                                oDetalleCotizacion.bonificacion = precioBonificacion;
                                db.CCOTIZACIONDETALLE.Update(oDetalleCotizacion);
                                db.SaveChanges();
                            }
                        }

                        detalle[i].idpreingreso = preingreso.idpreingreso;
                        if (detalle[i].tipo.Contains("ORDENCOMPRA") || detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                            detalle[i].tabla = "DetalleOrdenCompra";
                        else if (detalle[i].tipo.Contains("BONIFICACION"))
                            detalle[i].tabla = "BonificacionCotizacion";
                        //registro la factura al detalle si la cantidad es mayor a 0
                        if (detalle[i].idfactura is null || detalle[i].idfactura is 0)
                            //if (detalle[i].cantingresada > 0 || detalle[i].cantdevuelta > 0)
                            if (detalle[i].cantingresada != null || detalle[i].cantdevuelta != null)
                                detalle[i].idfactura = factura.idfactura;
                    }
                    await db.PIPREINGRESODETALLE.AddRangeAsync(detalle);
                    await db.SaveChangesAsync();

                    //EDITAR ESTADO DE OC
                    var estado = getestadoorden(detalle);
                    var oc = db.CORDENCOMPRA.Find(preingreso.idordencompra);
                    if (estado != oc.estado)
                    {
                        oc.estado = estado;
                        db.Update(oc);
                        await db.SaveChangesAsync();

                    }
                    //if (oc.estado == "COMPRA COMPLETADA" && preingreso.estado == "PENDIENTE")
                    //{
                    //    preingreso.estado = "TERMINADO";
                    //    db.Update(preingreso);
                    //    db.SaveChanges();
                    //}
                    List<PIPreingresoDetalle> lDetallePI = new();
                    foreach (var item in detalle)
                    {
                        var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                        if (objProducto.idtipoproducto != "EC" && objProducto.idtipoproducto != "SV")
                        {
                            lDetallePI.Add(item);
                        }
                    }
                    List<PILote> lotes = new List<PILote>();
                    //guardar lotes
                    foreach (var item in lDetallePI)
                    {
                        if (item.lotes != null)
                        {
                            if (item.lotes.Length != 0)
                            {
                                for (int i = 0; i < item.lotes.Length; i++)
                                {
                                    item.lotes[i].iddetallepreingreso = item.iddetallepreingreso;
                                    item.lotes[i].estado = "HABILITADO";
                                    item.lotes[i].idproducto = item.idproducto;
                                }
                                lotes.AddRange(item.lotes);
                            }
                            else
                            {//si no se ingreso lote por defecto guarda el de la factura ingresada
                                if (item.cantingresada != null && item.cantingresada > 0)
                                {
                                    var auxloteobj = new PILote();
                                    auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                    auxloteobj.cantidad = item.cantingresada.Value;
                                    auxloteobj.observacion = "Ingreso por defecto";
                                    auxloteobj.idproducto = item.idproducto;
                                    lotes.Add(auxloteobj);
                                }

                            }

                        }
                        else
                        {//si no se ingreso lote por defecto guarda el de la factura ingresada
                            if (item.cantingresada != null && item.cantingresada > 0)
                            {
                                var auxloteobj = new PILote();
                                auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                auxloteobj.cantidad = item.cantingresada.Value;
                                auxloteobj.observacion = "Ingreso por defecto";
                                auxloteobj.idproducto = item.idproducto;

                                lotes.Add(auxloteobj);
                            }
                        }
                    }
                    db.PILOTE.AddRange(lotes);
                    db.SaveChanges();
                    foreach (var item in lotes)
                    {                      
                        var idlotenew = item.idlote;
                        var nombrecarpeta = item.nomcodcarpeta;
                        var nomdocu = item.nomcoddocumento;
                        if(idlotenew != 0 && nombrecarpeta!="" && nomdocu != "")
                        {
                            subirarchivoapi(nombrecarpeta, nomdocu, idlotenew, idempleado,rutadoc);
                        }
                      
                            
                    }
                        //guardar condicion de embalaje
                        var resembalaje = await GuardarCondicionEmbalajeAsync(lDetallePI);
                    if (resembalaje != "ok")
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("Error al guardar las condicione sd embalaje", null));
                    }

                    List<PILote> lotesFiltro = new List<PILote>();
                    foreach (var item in lotes)
                    {
                        var objDetPreIng = db.PIPREINGRESODETALLE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).FirstOrDefault();
                        var objProducto = db.APRODUCTO.Where(x => x.idproducto == objDetPreIng.idproducto).FirstOrDefault();
                        if (objProducto.idtipoproducto != "IS")
                        {
                            lotesFiltro.Add(item);
                        }
                    }
                    var respstock = CrearStockPreingresoAsync(lotesFiltro, preingreso, lAlmacenSucursal);
                    if (respstock == "ok")
                    {

                        transaccion.Commit();
                        return new mensajeJson("ok", preingreso);

                    }
                    else
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("Error al cargar el stock", null));

                    }



                }
                catch (Exception e)
                {

                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return (new mensajeJson(e.Message + "->" + error, null));
                }
            }
        }
        private async Task<mensajeJson> EditarGuiaAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var aux = await db.PIPREINGRESO.FindAsync(preingreso.idpreingreso);
                    var USER = await Appuser.FindByIdAsync(user.getIdUserSession());
                    if (aux.estado == "PENDIENTE" || await Appuser.IsInRoleAsync(USER, "ADMINISTRADOR"))
                    {
                        aux.observacion = preingreso.observacion;
                        aux.obs = preingreso.obs;
                        aux.rechazadoporerror = preingreso.rechazadoporerror;
                        aux.estado = preingreso.estado;
                        aux.idalmacensucursal = preingreso.idalmacensucursal;
                        aux.estado = preingreso.estado;

                        db.PIPREINGRESO.Update(aux);
                        await db.SaveChangesAsync();

                        var detalle = JsonConvert.DeserializeObject<List<PIPreingresoDetalle>>(preingreso.jsondetalle);
                        var factura = db.PIFACTURASPREINGRESO.Where(x => x.serie == preingreso.seriedoc && x.numdoc == preingreso.numerodoc && x.idpreingreso == preingreso.idpreingreso).FirstOrDefault();

                        List<PIPreingresoDetalle> detalleSinFactura = new List<PIPreingresoDetalle>();
                        foreach (var item in detalle)
                        {
                            if (item.idfactura < 1 || item.idfactura is null || item.idfactura == null)
                            {
                                detalleSinFactura.Add(item);
                            }
                        }
                        detalle = detalleSinFactura;

                        if (factura != null)
                        {
                            if (factura.estado == "HABILITADO" || factura.estado == "APROBADO")
                            {
                                transaccion.Rollback();
                                return new mensajeJson($"No se puede guardar, porque la factura esta {factura.estado} ", null);
                            }
                        }

                        factura = new PIFacturaPreingreso
                        {
                            idpreingreso = preingreso.idpreingreso,
                            estado = "APROBADO",
                            serie = preingreso.seriedoc,
                            numdoc = preingreso.numerodoc,
                            fecha = preingreso.fechadoc,
                            iddocumento = preingreso.iddocumento,
                            idproveedor = preingreso.idproveedor
                        };
                        await db.PIFACTURASPREINGRESO.AddAsync(factura);
                        await db.SaveChangesAsync();

                        for (int i = 0; i < detalle.Count; i++)
                        {
                            if (detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                            {
                                if (detalle[i].iddetalle == 0 || detalle[i].idcotizacionbonfi == 0 ||
                                    detalle[i].iddetalle == null || detalle[i].idcotizacionbonfi == null ||
                                    detalle[i].iddetalle is null || detalle[i].idcotizacionbonfi is null)
                                {
                                    detalle[i].cantoc = detalle[i].cantfactura;
                                    var filtroItem = detalle.Where(x => x.idcotizacionbonfi > 0).FirstOrDefault();
                                    var cualquierItemDetalleCotizacion = db.CCOTIZACIONDETALLE.Find(filtroItem.idcotizacionbonfi);
                                    CCotizacionDetalle obj_cotizacionDetalle = new CCotizacionDetalle();
                                    obj_cotizacionDetalle.idcotizacion = cualquierItemDetalleCotizacion.idcotizacion;
                                    obj_cotizacionDetalle.idproducto = detalle[i].idproducto;
                                    obj_cotizacionDetalle.cantidad = (int)detalle[i].cantfactura;
                                    obj_cotizacionDetalle.pvf = 0;
                                    obj_cotizacionDetalle.des1 = 0;
                                    obj_cotizacionDetalle.des2 = 0;
                                    obj_cotizacionDetalle.des3 = 0;
                                    obj_cotizacionDetalle.costo = 0;
                                    obj_cotizacionDetalle.total = 0;
                                    obj_cotizacionDetalle.vvf = 0;
                                    obj_cotizacionDetalle.subtotal = 0;
                                    obj_cotizacionDetalle.estado = "HABILITADO";
                                    obj_cotizacionDetalle.montofacturar = 0;
                                    db.CCOTIZACIONDETALLE.Add(obj_cotizacionDetalle);
                                    db.SaveChanges();

                                    if (obj_cotizacionDetalle.iddetallecotizacion > 0)
                                    {
                                        var cualquierItemDetalleOrdenCompra = db.CORDENCOMPRADETALLE.Where(x => x.iddetallecotizacion == cualquierItemDetalleCotizacion.iddetallecotizacion).FirstOrDefault();
                                        COrdenDetalle obj_ordenDetalle = new COrdenDetalle();
                                        obj_ordenDetalle.idordencompra = cualquierItemDetalleOrdenCompra.idordencompra;
                                        obj_ordenDetalle.iddetallecotizacion = obj_cotizacionDetalle.iddetallecotizacion;
                                        obj_ordenDetalle.estado = "HABILITADO";
                                        db.CORDENCOMPRADETALLE.Add(obj_ordenDetalle);
                                        db.SaveChanges();

                                        if (obj_ordenDetalle.idordendetalle > 0)
                                        {
                                            detalle[i].idcotizacionbonfi = obj_cotizacionDetalle.iddetallecotizacion;
                                            detalle[i].iddetalle = obj_ordenDetalle.idordendetalle;
                                        }
                                        else
                                        {
                                            transaccion.Rollback();
                                            return (new mensajeJson("Error al guardar el Item Devolución: Proceso OrdenCompraDetalle.", null));
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return (new mensajeJson("Error al guardar el Item Devolución: Proceso CotizacionDetalle.", null));
                                    }
                                }
                            }

                            if (detalle[i].tipo.Contains("BONIFICACION"))
                            {
                                if (detalle[i].iddetalle is null || detalle[i].iddetalle == 0 || detalle[i].iddetalle == null)
                                {
                                    var precioBonificacion = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).Select(x => x.pvf).FirstOrDefault() ?? 0;
                                    CBonificacionCotizacion oBonificacionCotizacion = new CBonificacionCotizacion();
                                    oBonificacionCotizacion.iddetallecotizacion = detalle[i].iddetallecotizacionbonificacion;
                                    oBonificacionCotizacion.cantidad = (int)detalle[i].cantfactura;
                                    oBonificacionCotizacion.precio = precioBonificacion;
                                    oBonificacionCotizacion.estado = "HABILITADO";
                                    oBonificacionCotizacion.idproducto = detalle[i].idproducto;
                                    oBonificacionCotizacion.tipo = detalle[i].tipo.Split(' ')[1];
                                    db.CBONIFICACIONCOTIZACION.Add(oBonificacionCotizacion);
                                    db.SaveChanges();

                                    detalle[i].iddetalle = oBonificacionCotizacion.idbonificacion;
                                    detalle[i].idcotizacionbonfi = detalle[i].iddetallecotizacionbonificacion;

                                    CCotizacionDetalle oDetalleCotizacion = new CCotizacionDetalle();
                                    oDetalleCotizacion = db.CCOTIZACIONDETALLE.Where(x => x.iddetallecotizacion == detalle[i].iddetallecotizacionbonificacion).FirstOrDefault();

                                    if (oBonificacionCotizacion.tipo == "AFECTO")
                                    {
                                        if (oDetalleCotizacion.idproducto == detalle[i].idproducto)
                                        {
                                            var nuevoCosto = oDetalleCotizacion.total / (oDetalleCotizacion.cantidad + detalle[i].cantingresada);
                                            oDetalleCotizacion.costo = nuevoCosto;
                                            oDetalleCotizacion.montofacturar = nuevoCosto;
                                        }
                                        else
                                        {
                                            var nuevoTotal = oDetalleCotizacion.total - precioBonificacion;
                                            oDetalleCotizacion.total = nuevoTotal;
                                            oDetalleCotizacion.subtotal = (decimal?)Math.Round(Convert.ToDecimal(nuevoTotal / Convert.ToDecimal(1.18)), 2);
                                            var nuevoCosto = nuevoTotal / oDetalleCotizacion.cantidad;
                                            oDetalleCotizacion.costo = nuevoCosto;
                                            oDetalleCotizacion.montofacturar = nuevoCosto;
                                        }
                                    }

                                    oDetalleCotizacion.bonificacion = precioBonificacion;
                                    db.CCOTIZACIONDETALLE.Update(oDetalleCotizacion);
                                    db.SaveChanges();
                                }
                            }

                            detalle[i].idpreingreso = preingreso.idpreingreso;
                            if (detalle[i].tipo.Contains("ORDENCOMPRA") || detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                                detalle[i].tabla = "DetalleOrdenCompra";
                            else if (detalle[i].tipo.Contains("BONIFICACION"))
                                detalle[i].tabla = "BonificacionCotizacion";
                            //registro la factura al detalle si la cantidad es mayor a 0
                            if (detalle[i].idfactura is null || detalle[i].idfactura is 0)
                                //if (detalle[i].cantingresada > 0 || detalle[i].cantdevuelta > 0)
                                if (detalle[i].cantingresada != null || detalle[i].cantdevuelta != null)
                                    detalle[i].idfactura = factura.idfactura;

                        }
                        db.PIPREINGRESODETALLE.UpdateRange(detalle);
                        await db.SaveChangesAsync();

                        //EDITAR ESTADO DE OC
                        var estado = getestadoorden(detalle);
                        var oc = db.CORDENCOMPRA.Find(aux.idordencompra);
                        if (estado != oc.estado)
                        {
                            oc.estado = estado;
                            db.Update(oc);
                            await db.SaveChangesAsync();
                        }

                        List<PILote> lotes = new List<PILote>();
                        List<PIPreingresoDetalle> SinECdetalle = new();
                        foreach (var item in detalle)
                        {
                            var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                            if (objProducto.idtipoproducto != "EC")
                            {
                                SinECdetalle.Add(item);
                            }
                        }
                        foreach (var item in SinECdetalle)
                        {
                            if (item.lotes != null)
                            {
                                if (item.lotes.Length != 0)
                                {
                                    for (int i = 0; i < item.lotes.Length; i++)
                                    {
                                        item.lotes[i].iddetallepreingreso = item.iddetallepreingreso;
                                        item.lotes[i].estado = "HABILITADO";
                                        item.lotes[i].idproducto = item.idproducto;
                                    }
                                    lotes.AddRange(item.lotes);
                                }
                                else
                                {//si no se ingreso lote por defecto guarda el de la factura ingresada
                                    if (item.cantingresada != null && item.cantingresada > 0)
                                    {
                                        var auxloteobj = new PILote();
                                        auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                        auxloteobj.cantidad = item.cantingresada.Value;
                                        auxloteobj.observacion = "Ingreso por defecto";
                                        auxloteobj.idproducto = item.idproducto;
                                        lotes.Add(auxloteobj);
                                    }

                                }

                            }
                            else
                            {//si no se ingreso lote por defecto guarda el de la factura ingresada
                                if (item.cantingresada != null && item.cantingresada > 0)
                                {
                                    var auxloteobj = new PILote();
                                    auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                    auxloteobj.cantidad = item.cantingresada.Value;
                                    auxloteobj.observacion = "Ingreso por defecto";
                                    auxloteobj.idproducto = item.idproducto;

                                    lotes.Add(auxloteobj);
                                }
                            }
                        }
                        db.PILOTE.AddRange(lotes);
                        db.SaveChanges();
                        var resembalaje = await GuardarCondicionEmbalajeAsync(SinECdetalle);
                        if (resembalaje != "ok")
                        {
                            transaccion.Rollback();
                            return (new mensajeJson("Error al guardar las condicione sd embalaje", null));
                        }

                        foreach (var item in detalle)
                        {
                            if (item.cantingresada != null || item.cantdevuelta != null || item.cantingresada > 0 || item.cantdevuelta > 0)
                            {
                                var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                                if (objProducto.idtipoproducto == "PT")
                                {
                                    AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                    oStockLotePro.idproducto = objProducto.idproducto;
                                    if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("PRODUCTO TERMINADO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                    if (oAlmacenSucursal != null)
                                    {
                                        oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                        var oLoteLista = lotes.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).ToList();
                                        for (int i = 0; i < oLoteLista.Count(); i++)
                                        {
                                            var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == oLoteLista[i].lote && x.idalmacensucursal == oStockLotePro.idalmacensucursal && x.idproducto == item.idproducto).FirstOrDefault();
                                            oLoteLista[i].cantidad = Convert.ToInt32(oLoteLista[i].cantidad * objProducto.multiplo);
                                            if (validarStock != null)
                                            {
                                                validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), oLoteLista[i].cantidad.ToString());
                                                validarStock.candisponible += oLoteLista[i].cantidad;
                                                db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                                await db.SaveChangesAsync();
                                            }
                                            else
                                            {
                                                oStockLotePro.fechavencimiento = oLoteLista[i].fechavencimiento;
                                                oStockLotePro.lote = oLoteLista[i].lote;
                                                oStockLotePro.regsanitario = oLoteLista[i].registrosanitario;
                                                oStockLotePro.idtabla = oLoteLista[i].idlote.ToString();

                                                oStockLotePro.estado = "HABILITADO";

                                                oStockLotePro.candisponible = oLoteLista[i].cantidad;
                                                oStockLotePro.caningreso = oLoteLista[i].cantidad;
                                                oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                                oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                                oStockLotePro.tabla = "FacturaPreIngreso";
                                                oStockLotePro.idtabla = factura.idfactura.ToString();
                                                oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                                oStockLotePro.idstock = 0;
                                                await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                                await db.SaveChangesAsync();
                                            }
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return new mensajeJson("No hay almacén para ingresar el producto PT.", null);
                                    }
                                }
                                else if (objProducto.idtipoproducto == "EC")
                                {
                                    AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                    oStockLotePro.idproducto = objProducto.idproducto;
                                    if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("ECONOMATO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                    if (oAlmacenSucursal != null)
                                    {
                                        var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.idalmacensucursal == oAlmacenSucursal.idalmacensucursal && x.idproducto == item.idproducto && x.estado == "HABILITADO").FirstOrDefault();
                                        item.cantingresada = Convert.ToInt32(item.cantingresada * objProducto.multiplo);
                                        if (validarStock != null)
                                        {
                                            validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), item.cantingresada.ToString());
                                            validarStock.candisponible += item.cantingresada;
                                            db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                            await db.SaveChangesAsync();
                                        }
                                        else
                                        {
                                            oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                            oStockLotePro.estado = "HABILITADO";

                                            oStockLotePro.candisponible = item.cantingresada;
                                            oStockLotePro.caningreso = item.cantingresada;
                                            oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                            oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                            oStockLotePro.tabla = "FacturaPreIngreso";
                                            oStockLotePro.idtabla = factura.idfactura.ToString();
                                            oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                            await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                            await db.SaveChangesAsync();
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return new mensajeJson("No hay almacén para ingresar el producto " + objProducto.nombre, null);
                                    }
                                }
                                else if (objProducto.idtipoproducto == "IS")
                                {
                                    AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                    oStockLotePro.idproducto = objProducto.idproducto;
                                    if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("INSUMOS") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                    if (oAlmacenSucursal != null)
                                    {
                                        oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                        var oLoteLista = lotes.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).ToList();
                                        for (int i = 0; i < oLoteLista.Count(); i++)
                                        {
                                            var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == oLoteLista[i].lote && x.idalmacensucursal == oStockLotePro.idalmacensucursal && x.idproducto == item.idproducto).FirstOrDefault();
                                            oLoteLista[i].cantidad = Convert.ToInt32(oLoteLista[i].cantidad * objProducto.multiplo);
                                            if (validarStock != null)
                                            {
                                                validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), oLoteLista[i].cantidad.ToString());
                                                validarStock.candisponible += oLoteLista[i].cantidad;
                                                db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                                await db.SaveChangesAsync();
                                            }
                                            else
                                            {
                                                oStockLotePro.fechavencimiento = oLoteLista[i].fechavencimiento;
                                                oStockLotePro.lote = oLoteLista[i].lote;
                                                oStockLotePro.regsanitario = oLoteLista[i].registrosanitario;
                                                oStockLotePro.idtabla = oLoteLista[i].idlote.ToString();

                                                oStockLotePro.estado = "HABILITADO";

                                                oStockLotePro.candisponible = oLoteLista[i].cantidad;
                                                oStockLotePro.caningreso = oLoteLista[i].cantidad;
                                                oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                                oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                                oStockLotePro.tabla = "FacturaPreIngreso";
                                                oStockLotePro.idtabla = factura.idfactura.ToString();
                                                oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                                oStockLotePro.idstock = 0;
                                                await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                                await db.SaveChangesAsync();
                                            }
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return new mensajeJson("No hay almacén para ingresar el producto " + objProducto.nombre, null);
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return new mensajeJson("No se permite ingreso de Materia Prima por una guía" + objProducto.nombre, null);
                                }
                            }
                        }
                        transaccion.Commit();
                        return new mensajeJson("ok", preingreso);
                    }
                    else
                        return new mensajeJson("No se puede editar porque el preingreso esta " + aux.estado, null);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        private async Task<mensajeJson> RegistrarGuiaAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    preingreso.ano = DateTime.Now.Year;
                    preingreso.fecha = DateTime.Now;
                    preingreso.codigopreingreso = await generarcodigoAsync();
                    preingreso.idsucursal = user.getIdSucursalCookie();
                    preingreso.idempresa = user.getIdEmpresaCookie();
                    preingreso.idempleado = int.Parse(user.getIdUserSession());
                    await db.PIPREINGRESO.AddAsync(preingreso);
                    await db.SaveChangesAsync();
                    //REGISTRAR FACTURA DE PREINGRESO
                    var factura = new PIFacturaPreingreso
                    {
                        idpreingreso = preingreso.idpreingreso,
                        estado = "APROBADO",
                        serie = preingreso.seriedoc,
                        numdoc = preingreso.numerodoc,
                        fecha = preingreso.fechadoc,
                        iddocumento = preingreso.iddocumento,
                        idproveedor = preingreso.idproveedor
                    };
                    await db.PIFACTURASPREINGRESO.AddAsync(factura);
                    await db.SaveChangesAsync();
                    var detalle = JsonConvert.DeserializeObject<List<PIPreingresoDetalle>>(preingreso.jsondetalle);
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        if (detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                        {
                            if (detalle[i].iddetalle == 0 || detalle[i].idcotizacionbonfi == 0 ||
                                detalle[i].iddetalle == null || detalle[i].idcotizacionbonfi == null ||
                                detalle[i].iddetalle is null || detalle[i].idcotizacionbonfi is null)
                            {
                                detalle[i].cantoc = detalle[i].cantfactura;
                                var filtroItem = detalle.Where(x => x.idcotizacionbonfi > 0).FirstOrDefault();
                                var cualquierItemDetalleCotizacion = db.CCOTIZACIONDETALLE.Find(filtroItem.idcotizacionbonfi);
                                CCotizacionDetalle obj_cotizacionDetalle = new CCotizacionDetalle();
                                obj_cotizacionDetalle.idcotizacion = cualquierItemDetalleCotizacion.idcotizacion;
                                obj_cotizacionDetalle.idproducto = detalle[i].idproducto;
                                obj_cotizacionDetalle.cantidad = (int)detalle[i].cantfactura;
                                obj_cotizacionDetalle.pvf = 0;
                                obj_cotizacionDetalle.des1 = 0;
                                obj_cotizacionDetalle.des2 = 0;
                                obj_cotizacionDetalle.des3 = 0;
                                obj_cotizacionDetalle.costo = 0;
                                obj_cotizacionDetalle.total = 0;
                                obj_cotizacionDetalle.vvf = 0;
                                obj_cotizacionDetalle.subtotal = 0;
                                obj_cotizacionDetalle.estado = "HABILITADO";
                                obj_cotizacionDetalle.montofacturar = 0;
                                db.CCOTIZACIONDETALLE.Add(obj_cotizacionDetalle);
                                db.SaveChanges();

                                if (obj_cotizacionDetalle.iddetallecotizacion > 0)
                                {
                                    var cualquierItemDetalleOrdenCompra = db.CORDENCOMPRADETALLE.Where(x => x.iddetallecotizacion == cualquierItemDetalleCotizacion.iddetallecotizacion).FirstOrDefault();
                                    COrdenDetalle obj_ordenDetalle = new COrdenDetalle();
                                    obj_ordenDetalle.idordencompra = cualquierItemDetalleOrdenCompra.idordencompra;
                                    obj_ordenDetalle.iddetallecotizacion = obj_cotizacionDetalle.iddetallecotizacion;
                                    obj_ordenDetalle.estado = "HABILITADO";
                                    db.CORDENCOMPRADETALLE.Add(obj_ordenDetalle);
                                    db.SaveChanges();

                                    if (obj_ordenDetalle.idordendetalle > 0)
                                    {
                                        detalle[i].idcotizacionbonfi = obj_cotizacionDetalle.iddetallecotizacion;
                                        detalle[i].iddetalle = obj_ordenDetalle.idordendetalle;
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return (new mensajeJson("Error al guardar el Item Devolución: Proceso OrdenCompraDetalle.", null));
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return (new mensajeJson("Error al guardar el Item Devolución: Proceso CotizacionDetalle.", null));
                                }
                            }
                        }

                        if (detalle[i].tipo.Contains("BONIFICACION"))
                        {
                            if (detalle[i].iddetalle is null || detalle[i].iddetalle == 0 || detalle[i].iddetalle == null)
                            {
                                var precioBonificacion = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).Select(x => x.pvf).FirstOrDefault() ?? 0;
                                CBonificacionCotizacion oBonificacionCotizacion = new CBonificacionCotizacion();
                                oBonificacionCotizacion.iddetallecotizacion = detalle[i].iddetallecotizacionbonificacion;
                                oBonificacionCotizacion.cantidad = (int)detalle[i].cantfactura;
                                oBonificacionCotizacion.precio = precioBonificacion;
                                oBonificacionCotizacion.estado = "HABILITADO";
                                oBonificacionCotizacion.idproducto = detalle[i].idproducto;
                                oBonificacionCotizacion.tipo = detalle[i].tipo.Split(' ')[1];
                                db.CBONIFICACIONCOTIZACION.Add(oBonificacionCotizacion);
                                db.SaveChanges();

                                detalle[i].iddetalle = oBonificacionCotizacion.idbonificacion;
                                detalle[i].idcotizacionbonfi = detalle[i].iddetallecotizacionbonificacion;

                                CCotizacionDetalle oDetalleCotizacion = new CCotizacionDetalle();
                                oDetalleCotizacion = db.CCOTIZACIONDETALLE.Where(x => x.iddetallecotizacion == detalle[i].iddetallecotizacionbonificacion).FirstOrDefault();

                                if (oBonificacionCotizacion.tipo == "AFECTO")
                                {
                                    if (oDetalleCotizacion.idproducto == detalle[i].idproducto)
                                    {
                                        var nuevoCosto = oDetalleCotizacion.total / (oDetalleCotizacion.cantidad + detalle[i].cantingresada);
                                        oDetalleCotizacion.costo = nuevoCosto;
                                        oDetalleCotizacion.montofacturar = nuevoCosto;
                                    }
                                    else
                                    {
                                        var nuevoTotal = oDetalleCotizacion.total - precioBonificacion;
                                        oDetalleCotizacion.total = nuevoTotal;
                                        oDetalleCotizacion.subtotal = (decimal?)Math.Round(Convert.ToDecimal(nuevoTotal / Convert.ToDecimal(1.18)), 2);
                                        var nuevoCosto = nuevoTotal / oDetalleCotizacion.cantidad;
                                        oDetalleCotizacion.costo = nuevoCosto;
                                        oDetalleCotizacion.montofacturar = nuevoCosto;
                                    }
                                }

                                oDetalleCotizacion.bonificacion = precioBonificacion;
                                db.CCOTIZACIONDETALLE.Update(oDetalleCotizacion);
                                db.SaveChanges();
                            }
                        }

                        detalle[i].idpreingreso = preingreso.idpreingreso;
                        if (detalle[i].tipo.Contains("ORDENCOMPRA") || detalle[i].tipo.Contains("DEVOLUCION"))/*|| detalle[i].tipo.Contains("BON. FUERA DOC.")*/
                            detalle[i].tabla = "DetalleOrdenCompra";
                        else if (detalle[i].tipo.Contains("BONIFICACION"))
                            detalle[i].tabla = "BonificacionCotizacion";
                        //registro la factura al detalle si la cantidad es mayor a 0
                        if (detalle[i].idfactura is null || detalle[i].idfactura is 0)
                            //if (detalle[i].cantingresada > 0 || detalle[i].cantdevuelta > 0)
                            if (detalle[i].cantingresada != null || detalle[i].cantdevuelta != null)
                                detalle[i].idfactura = factura.idfactura;

                    }
                    db.PIPREINGRESODETALLE.UpdateRange(detalle);
                    await db.SaveChangesAsync();

                    //EDITAR ESTADO DE OC
                    var estado = getestadoorden(detalle);
                    var oc = db.CORDENCOMPRA.Find(preingreso.idordencompra);
                    if (estado != oc.estado)
                    {
                        oc.estado = estado;
                        db.Update(oc);
                        await db.SaveChangesAsync();
                    }

                    List<PILote> lotes = new List<PILote>();
                    List<PIPreingresoDetalle> SinECdetalle = new();
                    foreach (var item in detalle)
                    {
                        var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                        if (objProducto.idtipoproducto != "EC" || objProducto.idtipoproducto != "SV")
                        {
                            SinECdetalle.Add(item);
                        }
                    }
                    foreach (var item in SinECdetalle)
                    {
                        if (item.lotes != null)
                        {
                            if (item.lotes.Length != 0)
                            {
                                for (int i = 0; i < item.lotes.Length; i++)
                                {
                                    item.lotes[i].iddetallepreingreso = item.iddetallepreingreso;
                                    item.lotes[i].estado = "HABILITADO";
                                    item.lotes[i].idproducto = item.idproducto;
                                }
                                lotes.AddRange(item.lotes);
                            }
                            else
                            {//si no se ingreso lote por defecto guarda el de la factura ingresada
                                if (item.cantingresada != null && item.cantingresada > 0)
                                {
                                    var auxloteobj = new PILote();
                                    auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                    auxloteobj.cantidad = item.cantingresada.Value;
                                    auxloteobj.observacion = "Ingreso por defecto";
                                    auxloteobj.idproducto = item.idproducto;
                                    lotes.Add(auxloteobj);
                                }

                            }

                        }
                        else
                        {//si no se ingreso lote por defecto guarda el de la factura ingresada
                            if (item.cantingresada != null && item.cantingresada > 0)
                            {
                                var auxloteobj = new PILote();
                                auxloteobj.iddetallepreingreso = item.iddetallepreingreso;
                                auxloteobj.cantidad = item.cantingresada.Value;
                                auxloteobj.observacion = "Ingreso por defecto";
                                auxloteobj.idproducto = item.idproducto;

                                lotes.Add(auxloteobj);
                            }
                        }
                    }
                    db.PILOTE.AddRange(lotes);
                    db.SaveChanges();
                    var resembalaje = await GuardarCondicionEmbalajeAsync(SinECdetalle);
                    if (resembalaje != "ok")
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("Error al guardar las condicione sd embalaje", null));
                    }

                    foreach (var item in detalle)
                    {
                        if (item.cantingresada != null || item.cantdevuelta != null || item.cantingresada > 0 || item.cantdevuelta > 0)
                        {
                            var objProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                            if (objProducto.idtipoproducto == "PT")
                            {
                                AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                oStockLotePro.idproducto = objProducto.idproducto;
                                if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("PRODUCTO TERMINADO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                if (oAlmacenSucursal != null)
                                {
                                    oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                    var oLoteLista = lotes.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).ToList();
                                    for (int i = 0; i < oLoteLista.Count(); i++)
                                    {
                                        var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == oLoteLista[i].lote && x.idalmacensucursal == oStockLotePro.idalmacensucursal && x.idproducto == item.idproducto).FirstOrDefault();
                                        oLoteLista[i].cantidad = Convert.ToInt32(oLoteLista[i].cantidad * objProducto.multiplo);
                                        if (validarStock != null)
                                        {
                                            validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), oLoteLista[i].cantidad.ToString());
                                            validarStock.candisponible += oLoteLista[i].cantidad;
                                            db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                            await db.SaveChangesAsync();
                                        }
                                        else
                                        {
                                            oStockLotePro.fechavencimiento = oLoteLista[i].fechavencimiento;
                                            oStockLotePro.lote = oLoteLista[i].lote;
                                            oStockLotePro.regsanitario = oLoteLista[i].registrosanitario;
                                            oStockLotePro.idtabla = oLoteLista[i].idlote.ToString();

                                            oStockLotePro.estado = "HABILITADO";

                                            oStockLotePro.candisponible = oLoteLista[i].cantidad;
                                            oStockLotePro.caningreso = oLoteLista[i].cantidad;
                                            oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                            oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                            oStockLotePro.tabla = "FacturaPreIngreso";
                                            oStockLotePro.idtabla = factura.idfactura.ToString();
                                            oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                            oStockLotePro.idstock = 0;
                                            await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                            await db.SaveChangesAsync();
                                        }
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return new mensajeJson("No hay almacén para ingresar el producto PT.", null);
                                }
                            }
                            else if (objProducto.idtipoproducto == "EC")
                            {
                                AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                oStockLotePro.idproducto = objProducto.idproducto;
                                if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("ECONOMATO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                if (oAlmacenSucursal != null)
                                {
                                    var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.idalmacensucursal == oAlmacenSucursal.idalmacensucursal && x.idproducto == item.idproducto && x.estado == "HABILITADO").FirstOrDefault();
                                    item.cantingresada = Convert.ToInt32(item.cantingresada * objProducto.multiplo);
                                    if (validarStock != null)
                                    {
                                        validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), item.cantingresada.ToString());
                                        validarStock.candisponible += item.cantingresada;
                                        db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                        await db.SaveChangesAsync();
                                    }
                                    else
                                    {
                                        oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                        oStockLotePro.estado = "HABILITADO";

                                        oStockLotePro.candisponible = item.cantingresada;
                                        oStockLotePro.caningreso = item.cantingresada;
                                        oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                        oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                        oStockLotePro.tabla = "FacturaPreIngreso";
                                        oStockLotePro.idtabla = factura.idfactura.ToString();
                                        oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                        await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                        await db.SaveChangesAsync();
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return new mensajeJson("No hay almacén para ingresar el producto " + objProducto.nombre, null);
                                }
                            }
                            else if (objProducto.idtipoproducto == "IS")
                            {
                                AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                oStockLotePro.idproducto = objProducto.idproducto;
                                if (objProducto.multiplo is null) objProducto.multiplo = 1;
                                var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("INSUMOS") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                if (oAlmacenSucursal != null)
                                {
                                    oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                    var oLoteLista = lotes.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).ToList();
                                    for (int i = 0; i < oLoteLista.Count(); i++)
                                    {
                                        var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == oLoteLista[i].lote && x.idalmacensucursal == oStockLotePro.idalmacensucursal && x.idproducto == item.idproducto).FirstOrDefault();
                                        oLoteLista[i].cantidad = Convert.ToInt32(oLoteLista[i].cantidad * objProducto.multiplo);
                                        if (validarStock != null)
                                        {
                                            validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", factura.idfactura.ToString(), oLoteLista[i].cantidad.ToString());
                                            validarStock.candisponible += oLoteLista[i].cantidad;
                                            db.ASTOCKPRODUCTOLOTE.Update(validarStock);
                                            await db.SaveChangesAsync();
                                        }
                                        else
                                        {
                                            oStockLotePro.fechavencimiento = oLoteLista[i].fechavencimiento;
                                            oStockLotePro.lote = oLoteLista[i].lote;
                                            oStockLotePro.regsanitario = oLoteLista[i].registrosanitario;
                                            oStockLotePro.idtabla = oLoteLista[i].idlote.ToString();

                                            oStockLotePro.estado = "HABILITADO";

                                            oStockLotePro.candisponible = oLoteLista[i].cantidad;
                                            oStockLotePro.caningreso = oLoteLista[i].cantidad;
                                            oStockLotePro.multiplo = objProducto.multiplo ?? 1;
                                            oStockLotePro.multiploblister = objProducto.multiploblister ?? 1;

                                            oStockLotePro.tabla = "FacturaPreIngreso";
                                            oStockLotePro.idtabla = factura.idfactura.ToString();
                                            oStockLotePro.numfactura = factura.serie + factura.numdoc;
                                            oStockLotePro.idstock = 0;
                                            await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                            await db.SaveChangesAsync();
                                        }
                                    }
                                }
                                else
                                {
                                    transaccion.Rollback();
                                    return new mensajeJson("No hay almacén para ingresar el producto " + objProducto.nombre, null);
                                }
                            }
                            else
                            {
                                transaccion.Rollback();
                                return new mensajeJson("No se permite ingreso de Materia Prima por una guía" + objProducto.nombre, null);
                            }
                        }
                    }
                    transaccion.Commit();
                    return new mensajeJson("ok", preingreso);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        private string getestadoorden(/*int idorden,*/ List<PIPreingresoDetalle> detalle)
        {
            //string estado = db.CORDENCOMPRA.Find(idorden).estado;
            bool band = false;
            for (int i = 0; i < detalle.Count; i++)
            {
                if (detalle[i].idfactura is null)
                {
                    band = true;
                    break;
                }
            }
            if (band)
                return "PREINGRESO PARCIAL";
            else
                return "COMPRA COMPLETADA";
        }
        public async Task<string> RemoverCabeceraAsync(int id)
        {
            try
            {
                var obj = await db.PIPREINGRESO.FindAsync(id);
                db.PIPREINGRESO.Remove(obj);
                await db.SaveChangesAsync();
                return ("removido");
            }
            catch (Exception e)
            {
                return (e.Message);
            }
        }
        public async Task<mensajeJson> AnularPreingresoAsync(int id, int idfactura, string jsonstock)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    if (id is 0)
                        return new mensajeJson("El preingreso no ha sido registrado", null);
                    var preingreso = await db.PIPREINGRESO.FindAsync(id);
                    if (preingreso is null)
                        return new mensajeJson("El preingreso no existe", null);

                    //ANULAR FACTURA
                    var oFactura = db.PIFACTURASPREINGRESO.Find(idfactura);
                    oFactura.estado = "ANULADO";
                    db.PIFACTURASPREINGRESO.Update(oFactura);
                    await db.SaveChangesAsync();

                    //ANULAR ITEMS ASOCIADOS A ESA FACTURA Y AGREGAR NUEVOS CON CAMPOS LIMPIOS
                    var detalle = BuscarDetallePreIngresoPorPreIngreso(id);
                    var detallePorFactura = BuscarDetallePreIngresoPorFactura(idfactura);
                    foreach (var item in detallePorFactura)
                    {
                        item.estado = "ANULADO";
                    }
                    db.PIPREINGRESODETALLE.UpdateRange(detallePorFactura);
                    await db.SaveChangesAsync();
                    foreach (var item in detallePorFactura)
                    {
                        item.iddetallepreingreso = 0;
                        item.cantfactura = null;
                        item.cantingresada = null;
                        item.cantdevuelta = null;
                        item.idfactura = null;
                        item.factura = null;
                        item.estado = "HABILITADO";
                    }
                    db.PIPREINGRESODETALLE.AddRange(detallePorFactura);
                    await db.SaveChangesAsync();

                    int contadorValida = 0;
                    foreach (var item in detalle)
                    {
                        var oProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                        if (oProducto != null)
                        {
                            if (oProducto.idtipoproducto == "PT")
                            {
                                contadorValida += 1;
                            }
                        }
                    }

                    if (contadorValida > 0)
                    {
                        //ANULA STOCKLOTEPRODUCTO Y KARDEX;
                        var stockpreingreso = JsonConvert.DeserializeObject<List<AStockLoteProducto>>(jsonstock);
                        for (int i = 0; i < stockpreingreso.ToList().Count; i++)
                        {
                            var obj = new AStockLoteProducto();
                            stockpreingreso[i].estado = "HABILITADO";
                            stockpreingreso[i].edicion = obj.setedicion("ANULADO", "PreIngreso.Lote", preingreso.idpreingreso.ToString(), stockpreingreso[i]._cantidadlote.ToString());
                            stockpreingreso[i].candisponible -= Convert.ToInt32(stockpreingreso[i]._cantidadlote);
                        }
                        db.UpdateRange(stockpreingreso);
                        await db.SaveChangesAsync();
                    }

                    //VALIDAR SI HAY MÁS FACTURAS ASOCIADAS AL PRE INGRESO
                    var factura = BuscarFacturasPorPreIngresoHabilitados(id);
                    var numFacturasActivas = factura.Count;
                    if (numFacturasActivas == 0)
                    {
                        //ANULAR PREINGRESO.
                        preingreso.estado = "ANULADO";
                        db.PIPREINGRESO.Update(preingreso);
                        await db.SaveChangesAsync();

                        //ANULAR DETALLE PREINGRESO
                        //var detalle = BuscarDetallePreIngresoPorPreIngreso(id);
                        foreach (var item in detalle)
                        {
                            item.estado = "ANULADO";
                        }
                        db.UpdateRange(detalle);
                        await db.SaveChangesAsync();

                        foreach (var item in detallePorFactura)
                        {
                            item.estado = "ANULADO";
                        }
                        db.PIPREINGRESODETALLE.UpdateRange(detallePorFactura);
                        await db.SaveChangesAsync();

                        //CAMBIAR ESTADO COMPRA.
                        var orden = db.CORDENCOMPRA.Find(preingreso.idordencompra);
                        orden.estado = "APROBADO";
                        orden.fechautilizacion = DateTime.Now;
                        db.CORDENCOMPRA.Update(orden);
                        await db.SaveChangesAsync();
                    }

                    transaccion.Commit();
                    return (new mensajeJson("ok", null));
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return new mensajeJson(e.Message + " " + error, null);
                }
            }
        }
        public async Task<string> ActualizarOrdenCompraAplicadaAsync(int[] ordenes)
        {
            try
            {
                List<COrdenCompra> lista = new List<COrdenCompra>();
                foreach (var item in ordenes)
                {
                    var orden = db.CORDENCOMPRA.Find(item);
                    orden.estado = "APLICADA";
                    orden.fechautilizacion = DateTime.Now;
                    lista.Add(orden);
                }
                db.CORDENCOMPRA.UpdateRange(lista);
                await db.SaveChangesAsync();

                return ("ordenes actualizadas");
            }
            catch (Exception e)
            {
                return (e.Message);
            }
        }
        public async Task<mensajeJson> ActualizarLotesAsync(PILote[] lotes)
        {
            try
            {
                List<COrdenCompra> lista = new List<COrdenCompra>();
                db.PILOTE.UpdateRange(lotes);
                await db.SaveChangesAsync();

                return (new mensajeJson("ok", lotes));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> EliminarItemLoteAsync(int id, int iddetalle)
        {
            try
            {
                var firstdetalle = db.PIPREINGRESODETALLE.Where(x => x.iddetallepreingreso == iddetalle).FirstOrDefault();
                if (firstdetalle != null)
                {
                    var preingreso = await db.PIPREINGRESO.FindAsync(firstdetalle.idpreingreso);
                    if (preingreso.estado != "PENDIENTE")
                        return (new mensajeJson("No se puede editar porque el preingreso esta " + preingreso.estado, null));
                    var lote = await db.PILOTE.FindAsync(id);
                    lote.estado = "ELIMINADO";
                    db.PILOTE.Update(lote);
                    await db.SaveChangesAsync();

                    return (new mensajeJson("ok", null));
                }
                return (new mensajeJson("No se puede editar", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> BuscarLotesItemDetallePreingresoAsync(int id)
        {
            try
            {
                var data = await db.PILOTE.Where(x => x.iddetallepreingreso == id && x.estado != "ELIMINADO").ToListAsync();
                return (new mensajeJson("ok", data));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public mensajeJson VerificarIngresoOrdenAlmacenes(int orden, int sucursal)
        {

            var respuesta = verificarIgualdadAlmacenEntreDetalelOrdenSucursal(sucursal, orden);
            return (respuesta);
        }
        public async Task<PreingresoModel> datosinicioAsync()
        {
            PreingresoModel model = new PreingresoModel();
            model.documentos = await db.FDOCUMENTOTRIBUTARIO.Where(x => x.estado == "HABILITADO").ToListAsync();

            model.almacenes = await db.AAREAALMACEN.Where(x => x.descripcion == "CUARENTENA").ToListAsync();
            model.quimicolocal = db.SUCURSAL.Find(user.getIdSucursalCookie()).gerenteSucursal;
            return model;
        }
        public string sucursaldeloginesdelaempresa()
        {
            try
            {
                var sUCURSAL = db.SUCURSAL.Find(user.getIdSucursalCookie());
                string empresa = "";
                if (sUCURSAL.idempresa != null)
                    empresa = db.EMPRESA.Find(sUCURSAL.idempresa).descripcion;
                var aux = user.getIdEmpresaCookie();
                if (sUCURSAL.idempresa == user.getIdEmpresaCookie())
                    return "ok";
                else
                    return "Usted ha ingresado con la empresa " + user.getNombreEmpresaCookie() + " Y su local asignada  pertenece a " + empresa +
                        " No podrá acceder al modulo de PREINGRESO. Inicie nuevamente sesión y seleccione la empresa correcta.";

            }
            catch (Exception x)
            {
                return x.Message;
            }
        }
        public mensajeJson VerificarSiOrdenTienePreingreso(int idorden)
        {
            var data = db.PIPREINGRESO.Where(x => x.idordencompra == idorden && x.estado != "ANULADO").FirstOrDefault();
            if (data is null)
                return new mensajeJson("no tiene", null);
            else
                return new mensajeJson("tiene", data);
        }
        //public bool VerificarSihayBonificacion(int iddetallecotizacion)
        //{
        //    var bonificaciones = cotizacionEF.getBonificacion(iddetallecotizacion);
        //    var ingresos = db.PIDETALLEBONIFUERADOC.Where(x => x.idcotizacionbonfi == iddetallecotizacion).ToList();
        //    if (bonificaciones.Count > 0 && ingresos.Count == 0)
        //        return true;

        //}
        private async Task<string> generarcodigoAsync()
        {
            var tarea = await Task.Run(() =>
            {
                int empresa = user.getIdEmpresaCookie();
                int ano = DateTime.Now.Year;
                var num = db.PIPREINGRESO.Where(X => X.idempresa == empresa && X.ano == ano && X.idsucursal == user.getIdSucursalCookie()).Count();
                //num = num + 1;
                //AgregarCeros ceros = new AgregarCeros();
                //var auxcodigo = ceros.agregarCeros(num);
                var año = DateTime.UtcNow.Year.ToString();
                var codigo = "PI" + user.getIdSucursalCookie().ToString() + empresa + año.Substring(2, 2) + num;
                return codigo;
            });

            return tarea;

        }
        private mensajeJson verificarIgualdadAlmacenEntreDetalelOrdenSucursal(int sucursal, int orden)
        {
            var listasucursal = listarTipoAlmacenSucursal(sucursal);
            var listadetalle = listarTipoAlmacenOrdenDetalle(orden);
            var respuesta = false;
            foreach (var item in listadetalle)
            {
                foreach (var item2 in listasucursal)
                {
                    if (item == "SV")
                    {
                        respuesta = true;
                        break;
                    }
                    else
                    {
                        if (item == item2)
                        {
                            respuesta = true;
                            break;
                        }
                        else
                            respuesta = false;
                    }
                    
                }
                if (!respuesta)
                    break;
            }
            if (respuesta)
                return new mensajeJson("ok", null);
            else
            {
                string men1 = "";
                foreach (var item in listadetalle)
                {
                    men1 += " [" + item + "], ";
                }
                string men2 = "";
                if (listasucursal.Count == 0)
                    men2 = "[NINGUNO]";
                else
                    foreach (var item in listasucursal)
                    {
                        men2 += " [" + item + "], ";
                    }
                return new mensajeJson("La orden presenta items de " + men1 + " y la sucursal presenta almacenes solo para " + men2 + " .Comuniquese con el administrador para asignar los almacenes que faltan.", null);
            }

        }
        private List<string> listarTipoAlmacenSucursal(int sucursal)
        {
            try
            {
                var query = (from AA in db.AALMACENSUCURSAL
                             join A in db.AALMACEN on AA.idalmacen equals A.idalmacen
                             join TP in db.ATIPOPRODUCTO on A.idtipoproducto equals TP.idtipoproducto
                             where AA.estado == "HABILITADO"
                             && AA.suc_codigo == sucursal
                             select TP.idtipoproducto).Distinct().ToList();
                return query;
            }
            catch (Exception)
            {

                return new List<string>();
            }

        }
        private List<string> listarTipoAlmacenOrdenDetalle(int orden)
        {
            try
            {
                var query = (from OD in db.CORDENCOMPRADETALLE
                             join CD in db.CCOTIZACIONDETALLE on OD.iddetallecotizacion equals CD.iddetallecotizacion
                             join P in db.APRODUCTO on CD.idproducto equals P.idproducto
                             where OD.estado != "ELIMINADO"
                             && OD.idordencompra == orden
                             select P.idtipoproducto).Distinct().ToList();
                return query;
            }
            catch (Exception)
            {

                return new List<string>();
            }

        }
        public List<PIFacturaPreingreso> ListarFacturas(int id)
        {
            var data = db.PIFACTURASPREINGRESO.Where(x => x.estado != "ELIMINADO" && x.idpreingreso == id).ToList();
            return data;
        }
        private List<PILote> PrepararLotes(List<PILote> lista1, List<PILote> lista2)
        {
            List<PILote> lista = new List<PILote>();
            PILote obj = new PILote();
            bool aux = false;
            for (int i = 0; i < lista1.Count; i++)
            {
                aux = false;
                for (int j = 0; j < lista2.Count; j++)
                {
                    if (lista2[j].idlote != 0)
                        if (lista1[i].idlote == lista2[j].idlote)
                        {
                            obj = lista2[j];
                            aux = true;
                            break;
                        }
                }
                if (aux)
                    lista.Add(obj);
                else
                {
                    lista1[i].estado = "ELIMINADO";
                    lista.Add(lista1[i]);
                }
            }
            for (int j = 0; j < lista2.Count; j++)
            {
                if (lista2[j].idlote == 0)
                    lista.Add(lista2[j]);
            }

            return lista;

        }
        private int GetIndexListaLotes(List<PILote> lista, int idlote)
        {
            var pos = -1;
            for (int i = 0; i < lista.Count; i++)
            {
                if (lista[i].idlote == idlote)
                {
                    pos = i;
                    break;
                }
            }
            return pos;
        }
        private string CrearStockPreingresoAsync(List<PILote> lotes, PIPreingreso objpre, List<AAlmacenSucursal> lAlmacenSucursal)
        {
            try
            {
                if (lotes.Count > 0)
                {
                    // guardar stock de producto                  
                    //obtener todos los lotes de la factura       
                    lotes.ForEach(x => x.detallepreingreso.lotes = null);
                    lotes.ForEach(x => x.detallepreingreso.embalaje = null);
                    var json = JsonConvert.SerializeObject(lotes);
                    List<PILote> arraylotes = (JsonConvert.DeserializeObject<List<PILote>>(json));


                    var preingreso = objpre;
                    List<PILote> arraylotes2 = new List<PILote>();
                    //sumar lotes iguales
                    for (int i = 0; i < arraylotes.ToList().Count; i++)
                    {
                        var item = arraylotes[i];
                        if (item.estado != "USADO")
                        {
                            var _lotes = arraylotes.Where(x => x.idproducto == item.idproducto && x.lote == item.lote).ToList();//&& x.detallepreingreso.tipo != "BONIFICACION INAFECTO"
                            item.cantidad = _lotes.Sum(x => x.cantidad);
                            if (_lotes.Count > 1)
                                for (int j = 1; j < _lotes.Count; j++)
                                {
                                    var index = GetIndexListaLotes(arraylotes, _lotes[j].idlote);
                                    var obj = arraylotes[index];
                                    obj.estado = "USADO";
                                    arraylotes[index] = obj;
                                }

                            arraylotes2.Add(item);
                        }
                    }

                    //stock.idalmacensucursal = 10047;
                    var idalmacensucursal = 0;
                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("CUARENTENA") && x.areaalmacen.Contains("CUARENTENA") && x.estado == "HABILITADO").FirstOrDefault();
                    if (oAlmacenSucursal != null)
                    {
                        idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                    }
                    else
                    {
                        return "No se encontró almacén para ingresar el producto.";
                    }

                    List<AStockLoteProducto> listastock = new List<AStockLoteProducto>();
                    List<AStockLoteProducto> listaeditstock = new List<AStockLoteProducto>();
                    if (idalmacensucursal > 0)
                    {
                        for (int i = 0; i < arraylotes2.Count; i++)
                        {
                            if (!db.ASTOCKPRODUCTOLOTE.Where(x => x.idtabla == arraylotes2[i].idlote.ToString() && x.tabla == "Preingreso.Lote" && x.estado == "HABILITADO").Any())
                            {
                                var oStockLoteProducto = db.ASTOCKPRODUCTOLOTE.Where(x => x.idalmacensucursal == idalmacensucursal && x.lote == arraylotes2[i].lote && x.idproducto == arraylotes2[i].idproducto && x.estado == "HABILITADO").FirstOrDefault();
                                if (oStockLoteProducto != null)
                                {
                                    oStockLoteProducto.edicion = oStockLoteProducto.setedicion("INGRESO", "Preingreso.Lote", arraylotes2[i].idlote.ToString(), (arraylotes2[i].cantidad * oStockLoteProducto.multiplo).ToString());
                                    oStockLoteProducto.candisponible += arraylotes2[i].cantidad * oStockLoteProducto.multiplo;
                                    oStockLoteProducto.caningreso = oStockLoteProducto.candisponible;
                                    oStockLoteProducto.tabla = "Preingreso.Lote";
                                    oStockLoteProducto.idtabla = arraylotes2[i].idlote.ToString();
                                    oStockLoteProducto.numfactura = preingreso.seriedoc + preingreso.numerodoc;
                                    listaeditstock.Add(oStockLoteProducto);
                                }
                                else
                                {
                                    var producto = db.APRODUCTO.Find(arraylotes2[i].idproducto);
                                    AStockLoteProducto stock = new AStockLoteProducto();

                                    if (producto.multiplo is null || producto.multiplo is 0)
                                        stock.caningreso = arraylotes2[i].cantidad * 1;
                                    else
                                        stock.caningreso = arraylotes2[i].cantidad * (producto.multiplo.Value);

                                    stock.candisponible = stock.caningreso;
                                    stock.multiplo = (producto.multiplo) ?? 1;
                                    stock.multiploblister = producto.multiploblister ?? 1;
                                    stock.idproducto = arraylotes2[i].idproducto;
                                    stock.idalmacensucursal = idalmacensucursal;
                                    stock.fechavencimiento = arraylotes2[i].fechavencimiento;
                                    stock.lote = arraylotes2[i].lote;
                                    stock.estado = "HABILITADO";
                                    stock.regsanitario = arraylotes2[i].registrosanitario;
                                    stock.tabla = "Preingreso.Lote";
                                    stock.idtabla = arraylotes2[i].idlote.ToString();
                                    stock.numfactura = objpre.seriedoc + objpre.numerodoc;
                                    listastock.Add(stock);
                                }
                            }
                        }
                    }
                    if (listastock.Count > 0)
                    {
                        db.AddRange(listastock);
                        db.SaveChanges();
                    }
                    if (listaeditstock.Count > 0)
                    {
                        db.UpdateRange(listaeditstock);
                        db.SaveChanges();
                    }
                }
                
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        private async Task<string> GuardarCondicionEmbalajeAsync(List<PIPreingresoDetalle> detalle)
        {
            try
            {
                var condicionembalaje = new List<PICondicionEmbalaje>();
                foreach (var item in detalle)
                {
                    if (item.embalaje != null && item.embalaje.Count > 0)
                    {
                        var iddetallepreingreso = item.iddetallepreingreso;
                        var embalaje = item.embalaje;
                        embalaje.ForEach(x => x.iddetallepreingreso = iddetallepreingreso);
                        embalaje.ForEach(x => x.estado = "HABILITADO");
                        condicionembalaje.AddRange(embalaje);
                    }
                }

                var listanueva = new List<PICondicionEmbalaje>();
                var listaedicion = new List<PICondicionEmbalaje>();

                foreach (var item in condicionembalaje)
                {
                    if (item.iddetalle == 0) listanueva.Add(item); else listaedicion.Add(item);
                }
                if (listanueva.Count > 0)
                {
                    db.AddRange(listanueva);
                    await db.SaveChangesAsync();
                }
                if (listaedicion.Count > 0)
                {
                    db.UpdateRange(listaedicion);
                    await db.SaveChangesAsync();
                }

                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }


        }
        private List<PIPreingresoDetalle> BuscarDetallePreIngresoPorPreIngreso(int idpreingreso)
        {
            try
            {
                var data = db.PIPREINGRESODETALLE.Where(x => x.idpreingreso == idpreingreso && x.estado != "ANULADO").ToList();
                return data;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        private List<PIPreingresoDetalle> BuscarDetallePreIngresoPorFactura(int idfactura)
        {
            try
            {
                var data = db.PIPREINGRESODETALLE.Where(x => x.idfactura == idfactura && x.estado != "ANULADO").ToList();
                return data;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        private List<PIFacturaPreingreso> BuscarFacturasPorPreIngresoHabilitados(int idpreingreso)
        {
            try
            {
                var data = db.PIFACTURASPREINGRESO.Where(x => x.idpreingreso == idpreingreso && x.estado != "ANULADO").ToList();
                return data;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        // codigoguardar pdf drive YEX
        public void subirarchivoapi( string nomcodcarpeta, string nomcoddocumento, int idlotenew, int idempleado,string rutadoc)
        {
            string rutaBasica = AppDomain.CurrentDomain.BaseDirectory;
            string filePathruta = Path.GetFullPath(Path.Combine(rutaBasica, "..\\..\\..\\"));
            // se puede usar para registrar el nombre del primer archivo agregado
            var nombrecarpetad = nomcodcarpeta + " | " + idlotenew + " | " + nomcoddocumento;

            var nombrecarpedrive = nomcodcarpeta + " | " + idlotenew ;

            string filePathf = Path.GetFullPath(Path.Combine(rutadoc + "\\archivos\\pdf\\preingreso\\" + nomcodcarpeta + "\\" + nomcoddocumento));
            try
            {
                if (TokenEstaPorExpirar())
                {
                    // Obtener un nuevo token de acceso utilizando el token de actualización
                    ObtenerServicioDrive();
                }

                var driveService = ObtenerServicioDrive(); // Usar el servicio obtenido



                var parentId = "1iD-ub9M1crzguOiWdYsDdR3SG-htIEj9"; // Reemplaza con el ID correcto

                var folderMetadata = new Google.Apis.Drive.v3.Data.File
                {
                    Name = nombrecarpedrive,
                    MimeType = "application/vnd.google-apps.folder",
                    Parents = new[] { parentId }
                };

                var folder = driveService.Files.Create(folderMetadata).Execute();
                Console.WriteLine($"Carpeta creada con ID: {folder.Id}");

                var fileId = SubirArchivo(driveService, filePathf, folder.Id);





                //// Resto de tu código aquí...
                //var folderMetadata = new Google.Apis.Drive.v3.Data.File
                //{
                //    Name = nombrecarpetad,
                //    MimeType = "application/vnd.google-apps.folder",
                //    Parents = new[] { "1iD-ub9M1crzguOiWdYsDdR3SG-htIEj9" } // ID de la carpeta padre
                //};

                //var folder = driveService.Files.Create(folderMetadata).Execute();
                //Console.WriteLine($"Carpeta creada con ID: {folder.Id}");
                //var fileId = SubirArchivo(driveService, filePathf, folder.Id);



                if (fileId != null)
                {
                    var previewLink = ObtenerEnlaceVistaPrevia(driveService, fileId);
                    var resultado = ObtenerEnlaceYCodigoDrive(driveService, fileId);
                    Console.WriteLine($"Enlace de Vista Previa: {resultado.enlaceVistaPrevia}");
                    Console.WriteLine($"Código de Google Drive: {resultado.codigoDrive}");
                    Console.WriteLine($"Enlace de vista previa del archivo: {previewLink}");

                    string rutaeliminarcarpeta = Path.GetFullPath(Path.Combine(rutadoc + "\\archivos\\pdf\\preingreso\\" + nomcodcarpeta));
                    Directory.Delete(rutaeliminarcarpeta, true);


                    // guardar datos
                    List<DocumentosGuardadosDrive> guardardrive = new List<DocumentosGuardadosDrive>();
                    DocumentosGuardadosDrive guardrive = new DocumentosGuardadosDrive();
                    guardrive.idlote = idlotenew;
                    guardrive.usucrea = idempleado;
                    guardrive.usumodi = idempleado;
                    guardrive.nombrecarpeta = nombrecarpedrive;
                    guardrive.codigocarpeta = folder.Id;
                    guardrive.nombrearchivo = nomcoddocumento;
                    guardrive.codigoarchivo = resultado.codigoDrive;
                    guardrive.previzualizacionarchivo = previewLink;
                    guardardrive.Add(guardrive);
                    db.AddRange(guardardrive);
                    db.SaveChanges();
                }
                else
                {
                    List<DocumentosGuardadosDrive> guardardrive = new List<DocumentosGuardadosDrive>();
                    DocumentosGuardadosDrive guardrive = new DocumentosGuardadosDrive();
                   
                    guardrive.idlote = 15353;
                    guardrive.usucrea = 0;
                    guardrive.usumodi = 0;
                    guardrive.nombrecarpeta = fileId;
                    guardrive.codigocarpeta = "error";
                    guardrive.nombrearchivo = "error";
                    guardrive.codigoarchivo =  "error";
                    guardrive.previzualizacionarchivo = "error";
                    guardrive.fechacreacion = DateTime.Now;
                    guardrive.fechaModificacion = DateTime.Now;
                    guardardrive.Add(guardrive);
                    db.AddRange(guardardrive);
                    db.SaveChanges();
                }
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el método Index: {ex.Message}");
            }

        }

  

        private bool TokenEstaPorExpirar()
        {
            // Verificar si el token de acceso actual está a punto de expirar
            // Comparar directamente con la fecha y hora de expiración del token
            return (DateTime.Now >= expirationDateTime);
        }
        private void ObtenerNuevoAccessToken()
        {
            // Utilizar el token de actualización para obtener un nuevo token de acceso
            var clientId = "1003515477533-2fsb4cd996f6hhblu5sk986nsu5rf6kq.apps.googleusercontent.com";
            var clientSecret = "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";

            var tokenEndpoint = "https://oauth2.googleapis.com/token";

            var requestParams = new Dictionary<string, string>
        {
            {"grant_type", "refresh_token"},
            {"refresh_token", refreshToken},
            {"client_id", clientId},
            {"client_secret", clientSecret}
        };

            var client = new HttpClient();
            var tokenResponse = client.PostAsync(tokenEndpoint, new FormUrlEncodedContent(requestParams)).Result;

            if (tokenResponse.IsSuccessStatusCode)
            {
                var tokenData = JsonConvert.DeserializeObject<TokenResponse>(tokenResponse.Content.ReadAsStringAsync().Result);
                accessToken = tokenData.access_token;
                expirationDateTime = DateTime.Now.AddSeconds(tokenData.expires_in);
            }
            else
            {
                // Manejar el error de la solicitud del nuevo token de acceso
                // Aquí puedes lanzar una excepción, registrar el error, o tomar alguna acción apropiada.
            }
        }
        static string SubirArchivo(DriveService service, string direcionarchivo, string folderId)
        {
            try
            {
                var nombreruta = "";
                var fileMetadata = new Google.Apis.Drive.v3.Data.File
                {
                    Name = Path.GetFileName(direcionarchivo),
                    Parents = new[] { folderId }
                };
                nombreruta = Path.GetFileName("");
                using (var stream = new FileStream(direcionarchivo, FileMode.Open))
                {
                    var request = service.Files.Create(fileMetadata, stream, "application/pdf");
                    request.Upload();
                    return request.ResponseBody.Id;
                }
            }
            catch (Exception ex)
            {
                // Capturar el mensaje de error
                string errorMessage = $"Error en el método SubirArchivo: {ex.Message}";


                // Imprimir o registrar detalles del error
                Console.WriteLine(errorMessage);

                // También puedes lanzar la excepción nuevamente si lo deseas:
                // throw;

                // Retornar el mensaje de error

                return errorMessage;
            }

        }
        static string ObtenerEnlaceVistaPrevia(DriveService service, string fileId)
        {
            var file = service.Files.Get(fileId).Execute();
            return $"https://drive.google.com/file/d/{file.Id}/edit";

        }
        static (string enlaceVistaPrevia, string codigoDrive) ObtenerEnlaceYCodigoDrive(DriveService service, string fileId)
        {
            var file = service.Files.Get(fileId).Execute();
            return ($"https://drive.google.com/file/d/{file.Id}/preview", file.Id);
        }
        public class TokenResponse
        {
            public string access_token { get; set; }
            public string token_type { get; set; }
            public int expires_in { get; set; }
            public string refresh_token { get; set; }
        }
        public DriveService ObtenerServicioDrive()
        {

            try
            {

                string[] Scopes = { DriveService.Scope.Drive };

                string serviceAccountKeyPath = @"C:\VALIDACIONCREDENTIAL\credentials1.json";

                // Cargar las credenciales desde el archivo JSON de la cuenta de servicio
                GoogleCredential credential;
                using (var stream = new FileStream(serviceAccountKeyPath, FileMode.Open, FileAccess.Read))
                {
                    credential = GoogleCredential.FromStream(stream)
                        .CreateScoped(Scopes);
                }

                // Crear el servicio de Drive API.
                var service = new DriveService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "Drive API .NET Quickstart",
                });

                return service;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el método Index: {ex.Message}");
                return null;
            }
            
        }

        // FIN SUBIR ARCHIvO YEX


        // EDITAR ARCHIVO
        public (string nomcoddocumento, string codigodrive, string previewLinkpara) editararchivoapise(string codcarpeta, string nomcoddocumento,string rutadoc)
        {
            string rutaBasica = AppDomain.CurrentDomain.BaseDirectory;
            string filePathruta = Path.GetFullPath(Path.Combine(rutaBasica, "..\\..\\..\\"));
            string filePathf = Path.GetFullPath(Path.Combine(rutadoc + "\\archivos\\pdf\\preingreso\\" + codcarpeta + "\\" + nomcoddocumento));
            try
            {
                if (TokenEstaPorExpirar())
                {
                    // Obtener un nuevo token de acceso utilizando el token de actualización
                    ObtenerServicioDrive();
                }

                var driveService = ObtenerServicioDrive(); // Usar el servicio obtenido


                if(driveService!=null)
                {
                    var fileId = SubirArchivo(driveService, filePathf, codcarpeta);

                    var nombredrive = "";
                    var codigodrive = "";
                    var previewLinkpara = "";
                    if (fileId != null)
                    {
                        previewLinkpara = ObtenerEnlaceVistaPrevia(driveService, fileId);
                        var resultado = ObtenerEnlaceYCodigoDrive(driveService, fileId);
                        nombredrive = resultado.enlaceVistaPrevia;
                        codigodrive = resultado.codigoDrive;
                     
                        string rutaeliminarcarpeta = Path.GetFullPath(Path.Combine(rutadoc + "\\archivos\\pdf\\preingreso\\" + codcarpeta));
                        Directory.Delete(rutaeliminarcarpeta, true);
                    }

                    return (nomcoddocumento, codigodrive, previewLinkpara);
                }
                else
                {
                    return ("Error", "error", "error");
                }
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el método Index: {ex.Message}");
                return ("", "", "");
            }
        }
        public string eliminarchivodriveapisegundo(string codcarpeta, string coddocumento)
        {
            var mensajesalida = "";
            try
            {
                if (TokenEstaPorExpirar())
                {
                    // Obtener un nuevo token de acceso utilizando el token de actualización
                    ObtenerServicioDrive();
                }

                var driveService = ObtenerServicioDrive(); // Usar el servicio obtenido

                // Resto de tu código aquí...
                if (driveService!=null) {
                    EliminarArchivo(driveService, coddocumento);
                    mensajesalida = "eliminado";
                }
                else
                {
                    mensajesalida = "Error al encontrar el archivo credentials";
                  
                }
                return mensajesalida;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el método Index: {ex.Message}");
                return ex.Message;
            }

        }
        static void EliminarArchivo(DriveService service, string codigoArchivo)
        {
            try
            {
                service.Files.Delete(codigoArchivo).Execute();
                Console.WriteLine("Archivo eliminado correctamente.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al intentar eliminar el archivo: {ex.Message}");
            }
        }

        public mensajeJson eliminarchivodriveapi(string codcarpeta, string coddocumento)
        {
            var mensasalida = "";
            try
            {
                var eliminar =eliminarchivodriveapisegundo(codcarpeta, coddocumento);
                if (eliminar == "eliminado")
                {
                    mensasalida = "OK";
                }
                else
                {
                    mensasalida = eliminar;
                }
                return new mensajeJson(mensasalida, null);
            }
            catch (Exception ex)
            {
                return new mensajeJson("error", null);
            }
           
        }

        mensajeJson IPreingresoEF.editararchivoapi(string codcarpeta, string coddocumento,string rutadoc)
        {
            try
            {
                var resultado= editararchivoapise(codcarpeta, coddocumento, rutadoc);
                var respuesta = new
                {
                    mensaje = "OK",
                    nomcoddocumento = resultado.nomcoddocumento,
                     previewLink = resultado.previewLinkpara ,
                    codigoDrive = resultado.codigodrive,
                };
                return new mensajeJson("OK", respuesta);
            }
            catch (Exception ex)
            {
                return new mensajeJson("error", null);
            }
        }
    }
}
