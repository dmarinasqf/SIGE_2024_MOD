using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using ENTIDADES.compras;
using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class AprobarFacturaEF : IAprobarFacturaEF
    {
        private readonly Modelo db;
        private readonly IUser user;

        public AprobarFacturaEF(Modelo _db, IUser _user)
        {
            db = _db;
            user = _user;
        }
        public async Task<mensajeJson> AprobarFacturaAsync(PIFacturaPreingreso factura,PIPreingreso preingreso, List<PIPreingresoDetalle> detalle, List<CCotizacionDetalle> cotizaciondetalle, List<PreciosProducto> precioslistas, string jsonstock, List<CHistorialPrecios> historial, List<AAlmacenSucursal> lAlmacenSucursal)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var objfactura = db.PIFACTURASPREINGRESO.Find(factura.idfactura);
                 //   var preingreso = db.PIPREINGRESO.Find(objfactura.idpreingreso);
                    if (objfactura.estado == "HABILITADO")
                    {
                        if (objfactura.estado == "HABILITADO")
                        {
                            objfactura.usuarioaprueba = user.getIdUserSession();
                            objfactura.fechaaprobacion = DateTime.Now;                            
                        }
                        //actualizar factura preingreso
                        if (objfactura.estado == "HABILITADO" || objfactura.estado == "APROBADO")
                            objfactura.estado = "APROBADO";
                        objfactura.ncxdiferenciadesc = factura.ncxdiferenciadesc;
                        objfactura.ncxdevolucion = factura.ncxdevolucion;
                        objfactura.observacion = factura.observacion;
                        objfactura.idproveedor = factura.idproveedor;
                        db.Update(objfactura);
                        await db.SaveChangesAsync();
                        //actualizar preingreso
                        var detalleaux = new List<PIPreingresoDetalle>();
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            if (detalle[i].costo > 0 || detalle[i].costoigv > 0)
                            {
                                var aux = db.PIPREINGRESODETALLE.Find(detalle[i].iddetallepreingreso);
                                aux.costo = detalle[i].costo;
                                aux.costoigv = detalle[i].costoigv;
                                if (aux.costo != null || aux.costo > 0)
                                {
                                    detalleaux.Add(aux);
                                }
                            }
                        }
                        db.UpdateRange(detalleaux);
                        await db.SaveChangesAsync();
                        //actualizar precios de cotizacion
                        var savecoti = await ActualizarPreciosCotizacionAsync(cotizaciondetalle);
                        if (savecoti != "ok")
                        {
                            transaccion.Rollback();
                            return new mensajeJson(savecoti, null);

                        }

                        //actualizar precios de producto
                        //var producto = db.APRODUCTO.Where(element => element.codigoproducto == precioslistas[0].codigoproducto);

                        //actualizar precios de listas
                        var savepp = await ActualizarPreciosListasAsync(precioslistas);
                        if (savepp != "ok")
                        {
                            transaccion.Rollback();
                            return new mensajeJson(savepp, null);

                        }
                        var savhist = await IngresarHistorialComprasAsync(historial);
                        if (savhist!= "ok") {
                            transaccion.Rollback();
                            return new mensajeJson(savhist, null);

                        }

                        int contador = 0;
                        foreach(var item in detalle)
                        {
                            var objPreDet = db.PIPREINGRESODETALLE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).FirstOrDefault();
                            var objPro = db.APRODUCTO.Where(x => x.idproducto == objPreDet.idproducto).FirstOrDefault();
                            if (objPro.idtipoproducto == "PT")
                                contador++;
                        }

                        if (contador > 0)
                        {
                            var stock = JsonConvert.DeserializeObject<List<AStockLoteProducto>>(jsonstock);
                            //preingreso.idalmacensucursal = 10005;
                            var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("PRODUCTO TERMINADO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                            if (oAlmacenSucursal != null)
                            {
                                preingreso.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                            }
                            else
                            {
                                transaccion.Rollback();
                                return new mensajeJson("No hay almacén para ingresar el producto PT.", null);
                            }
                            if (stock != null)
                            {
                                var listaactualizacion = new List<AStockLoteProducto>();
                                if (stock.Count > 0)
                                {
                                    var stockaux = stock;
                                    var detallePreIngresoCompleto = db.PIPREINGRESODETALLE.Where(x => x.idfactura == objfactura.idfactura);
                                    for (int i = 0; i < stock.ToList().Count; i++)
                                    {
                                        //actulizo el stock del almacen a 0
                                        var obj = new AStockLoteProducto();
                                        if (preingreso.idalmacensucursal != stock[i].idalmacensucursal)
                                        {
                                            var objProInterno = db.APRODUCTO.Where(x => x.idproducto == stock[i].idproducto).FirstOrDefault();
                                            //var canIngreso = detallePreIngresoCompleto.Where(x => x.idproducto == stock[i].idproducto).Sum(x => x.cantingresada);
                                            //if (objProInterno.multiplo is null || objProInterno.multiplo == 0) objProInterno.multiplo = 1;
                                            //canIngreso *= objProInterno.multiplo;
                                            var canIngreso = stock[i]._cantidadlote;
                                            stock[i].edicion = obj.setedicion("TRANSFERENCIA", "FacturaPreingreso", factura.idfactura.ToString(), canIngreso.ToString());
                                            stock[i].candisponible -= Convert.ToInt32(canIngreso);
                                            listaactualizacion.Add(stock[i]);
                                        }
                                    }
                                    if (listaactualizacion.Count > 0)
                                    {
                                        db.UpdateRange(listaactualizacion);
                                        db.SaveChanges();
                                        var listanuevaaux = listaactualizacion;
                                        List<AStockLoteProducto> lStockAdd = new List<AStockLoteProducto>();
                                        List<AStockLoteProducto> lStockEdit = new List<AStockLoteProducto>();
                                        //creo nuevo stock para el almacen
                                        for (int i = 0; i < listanuevaaux.ToList().Count; i++)
                                        {
                                            var oStockLoteProducto = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == listanuevaaux[i].lote && x.idalmacensucursal == preingreso.idalmacensucursal && x.idproducto == listanuevaaux[i].idproducto && x.estado == "HABILITADO").FirstOrDefault();
                                            var objProInterno = db.APRODUCTO.Where(x => x.idproducto == listanuevaaux[i].idproducto).FirstOrDefault();
                                            //var canIngreso = detallePreIngresoCompleto.Where(x => x.idproducto == listanuevaaux[i].idproducto).Sum(x => x.cantingresada);
                                            //if (objProInterno.multiplo is null || objProInterno.multiplo == 0) objProInterno.multiplo = 1;
                                            //canIngreso *= objProInterno.multiplo;
                                            var canIngreso = Convert.ToInt32(listanuevaaux[i]._cantidadlote);
                                            if (oStockLoteProducto != null)
                                            {
                                                oStockLoteProducto.edicion = oStockLoteProducto.setedicion("INGRESO", "FacturaPreingreso", objfactura.idfactura.ToString(), canIngreso.ToString());
                                                oStockLoteProducto.candisponible += canIngreso;//stockaux.Where(x => x.idstock == listanuevaaux[i].idstock).FirstOrDefault().caningreso ?? 0;
                                                oStockLoteProducto.caningreso = canIngreso;// stockaux.Where(x => x.idstock == listanuevaaux[i].idstock).FirstOrDefault().caningreso ?? 0;
                                                oStockLoteProducto.idtabla = objfactura.idfactura.ToString();
                                                oStockLoteProducto.tabla = "FacturaPreingreso";
                                                oStockLoteProducto.numfactura = objfactura.serie + objfactura.numdoc;
                                                lStockEdit.Add(oStockLoteProducto);
                                            }
                                            else
                                            {
                                                listanuevaaux[i].candisponible = canIngreso;//stockaux.Where(x => x.idstock == listanuevaaux[i].idstock).FirstOrDefault().caningreso ?? 0;
                                                listanuevaaux[i].caningreso = canIngreso;//stockaux.Where(x => x.idstock == listanuevaaux[i].idstock).FirstOrDefault().caningreso ?? 0;
                                                listanuevaaux[i].idstock = 0;
                                                listanuevaaux[i].tabla = "FacturaPreingreso";
                                                listanuevaaux[i].idtabla = objfactura.idfactura.ToString();
                                                listanuevaaux[i].edicion = null;
                                                listanuevaaux[i].idalmacensucursal = preingreso.idalmacensucursal;
                                                lStockAdd.Add(listanuevaaux[i]);
                                            }
                                        }
                                        if (lStockAdd.Count > 0)
                                        {
                                            db.AddRange(lStockAdd);
                                        }
                                        if (lStockEdit.Count > 0)
                                        {
                                            db.UpdateRange(lStockEdit);
                                        }
                                        db.SaveChanges();
                                    }
                                }
                            }
                            else
                            {
                                transaccion.Rollback();
                                return new mensajeJson("Error al ingresar el stock.", null);
                            }
                        }

                        foreach (var item in detalle)
                        {
                            var objPro = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                            if (objPro.idtipoproducto == "EC" || objPro.idtipoproducto == "IS")
                            {
                                var objDetPr = db.PIPREINGRESODETALLE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).FirstOrDefault();
                                AStockLoteProducto oStockLotePro = new AStockLoteProducto();
                                oStockLotePro.idproducto = objPro.idproducto;

                                if (objPro.idtipoproducto == "EC")
                                {
                                    //oStockLotePro.idalmacensucursal = 10051;
                                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("ECONOMATO") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                    if (oAlmacenSucursal != null)
                                    {
                                        oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                        oStockLotePro.estado = "HABILITADO";

                                        oStockLotePro.candisponible = objDetPr.cantingresada;
                                        oStockLotePro.caningreso = objDetPr.cantingresada;
                                        oStockLotePro.multiplo = objPro.multiplo ?? 1;
                                        oStockLotePro.multiploblister = objPro.multiploblister ?? 1;

                                        oStockLotePro.tabla = "FacturaPreIngreso";
                                        oStockLotePro.idtabla = objfactura.idfactura.ToString();
                                        oStockLotePro.numfactura = objfactura.serie + objfactura.numdoc;
                                        await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                        await db.SaveChangesAsync();
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return new mensajeJson("No hay almacén para ingresar el producto " + objPro.nombre, null);
                                    }
                                }
                                else
                                {
                                    //oStockLotePro.idalmacensucursal = 10107;
                                    var oAlmacenSucursal = lAlmacenSucursal.Where(x => x.almacen.Contains("INSUMOS") && x.areaalmacen.Contains("APROBADO") && x.estado == "HABILITADO").FirstOrDefault();
                                    if (oAlmacenSucursal != null)
                                    {
                                        oStockLotePro.idalmacensucursal = oAlmacenSucursal.idalmacensucursal;
                                        var oLoteLista = db.PILOTE.Where(x => x.iddetallepreingreso == item.iddetallepreingreso).ToList();
                                        for (int i = 0; i < oLoteLista.Count(); i++)
                                        {
                                            var validarStock = db.ASTOCKPRODUCTOLOTE.Where(x => x.lote == oLoteLista[i].lote && x.idalmacensucursal == oStockLotePro.idalmacensucursal && x.idproducto == objDetPr.idproducto).FirstOrDefault();
                                            if (validarStock != null)
                                            {
                                                validarStock.edicion = oStockLotePro.setedicion("INGRESO", "FacturaPreingreso", objfactura.idfactura.ToString(), oLoteLista[i].cantidad.ToString());
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
                                                oStockLotePro.multiplo = objPro.multiplo ?? 1;
                                                oStockLotePro.multiploblister = objPro.multiploblister ?? 1;

                                                oStockLotePro.tabla = "FacturaPreIngreso";
                                                oStockLotePro.idtabla = objfactura.idfactura.ToString();
                                                oStockLotePro.numfactura = objfactura.serie + objfactura.numdoc;
                                                oStockLotePro.idstock = 0;
                                                await db.ASTOCKPRODUCTOLOTE.AddAsync(oStockLotePro);
                                                await db.SaveChangesAsync();
                                            }
                                        }
                                    }
                                    else
                                    {
                                        transaccion.Rollback();
                                        return new mensajeJson("No hay almacén para ingresar el producto " + objPro.nombre, null);
                                    }
                                }
                            }
                        }
                        
                        transaccion.Commit();
                        return new mensajeJson("ok", objfactura);
                    }
                    else if (objfactura.estado == "APROBADO")
                        return new mensajeJson("La factura ya ha sido aprobada el día " + objfactura.fechaaprobacion.ToString(), null);
                    else
                        return new mensajeJson("No puede editarse la factura porque esta " + objfactura.estado, null);

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

        private async Task<string> ActualizarPreciosCotizacionAsync(List<CCotizacionDetalle> cotizaciondetalle)
        {
            try
            {
                if (cotizaciondetalle.Count > 0)
                {
                    var detallecotiaux = new List<CCotizacionDetalle>();

                    for (int i = 0; i < cotizaciondetalle.Count; i++)
                    {
                        if (cotizaciondetalle[i].iddetallecotizacion > 0)
                        {
                            CCotizacionDetalle obj = new CCotizacionDetalle();
                            obj = db.CCOTIZACIONDETALLE.Find(cotizaciondetalle[i].iddetallecotizacion);
                            obj.vvf = cotizaciondetalle[i].vvf;
                            obj.pvf = cotizaciondetalle[i].pvf;
                            obj.cantidad = cotizaciondetalle[i].cantidad;
                            obj.bonificacion = cotizaciondetalle[i].bonificacion;
                            obj.des1 = cotizaciondetalle[i].des1;
                            obj.des2 = cotizaciondetalle[i].des2;
                            obj.des3 = cotizaciondetalle[i].des3;
                            obj.total = cotizaciondetalle[i].total;
                            obj.subtotal = cotizaciondetalle[i].subtotal;
                            obj.costo = cotizaciondetalle[i].costo;
                            obj.montofacturar = cotizaciondetalle[i].montofacturar;
                            obj.idmoneda = cotizaciondetalle[i].idmoneda;
                            obj.cambio = cotizaciondetalle[i].cambio;
                            detallecotiaux.Add(obj);

                            AProducto obj_pro = new AProducto();
                            obj_pro = db.APRODUCTO.Find(cotizaciondetalle[i].idproducto);
                            obj_pro.pvf = cotizaciondetalle[i].pvf;
                            obj_pro.vvf = cotizaciondetalle[i].vvf;
                            db.Update(obj_pro);
                            await db.SaveChangesAsync();
                        }
                    }
                    db.UpdateRange(detallecotiaux);
                    await db.SaveChangesAsync();
                }

                return "ok";

            }
            catch (Exception e)
            {

                return e.Message;
            }

        }
        private async Task<string> IngresarHistorialComprasAsync(List<CHistorialPrecios> historial)
        {
            try
            {
                if (historial.Count > 0)
                {
                    for (int i = 0; i < historial.Count; i++)
                    {
                        historial[i].id = 0;
                        historial[i].idproducto = Convert.ToInt32(historial[i].idproducto);
                        historial[i].idempresa = Convert.ToInt32(user.getIdEmpresaCookie());
                        historial[i].bonificacion = Convert.ToDecimal(historial[i].bonificacion);
                        historial[i].cantidad = Convert.ToDecimal(historial[i].cantidad);
                        historial[i].costo = Convert.ToDecimal(historial[i].costo);
                        historial[i].costofact = Convert.ToDecimal(historial[i].costofact);
                        historial[i].dsc1 = Convert.ToDecimal(historial[i].dsc1);
                        historial[i].dsc2 = Convert.ToDecimal(historial[i].dsc2);
                        historial[i].dsc3 = Convert.ToDecimal(historial[i].dsc3);
                        historial[i].pvf = Convert.ToDecimal(historial[i].pvf);
                        historial[i].vvf = Convert.ToDecimal(historial[i].vvf);
                        historial[i].subtotal = Convert.ToDecimal(historial[i].subtotal);
                        historial[i].total = Convert.ToDecimal(historial[i].total);
                        db.Add(historial[i]);
                        await db.SaveChangesAsync();
                    }
                    //db.AddRange(historial);
                    //await db.SaveChangesAsync();
                }
                return "ok";

            }
            catch (Exception e)
            {

                return e.Message;
            }
        }
        private async Task<string> ActualizarPreciosListasAsync(List<PreciosProducto> precios)
        {
            try
            {
                if (precios.Count > 0)
                {
                    List<PreciosProducto> precioaux = new List<PreciosProducto>();
                    //List<AProducto> lProductolista = new List<AProducto>();
                    foreach (var item in precios)
                    {
                        var obj = db.PRECIOSPRODUCTO.Find(item.idprecioproducto);
                        obj.precio = item.precio;
                        obj.precioxfraccion = item.precioxfraccion;
                        obj.precioxblister = item.precioxblister;
                        precioaux.Add(obj);

                        //var obj_prod = db.APRODUCTO.Where(x => x.codigoproducto == item.codigoproducto).FirstOrDefault();
                        //if (obj_prod != null || obj_prod is not null)
                        //{
                        //    if (lProductolista.Where(x=>x.codigoproducto == item.codigoproducto).Count() < 1)
                        //    {
                        //        obj_prod.pvfp = item.precio;
                        //        obj_prod.precioxfraccion = item.precioxfraccion;
                        //        obj_prod.precioxblister = item.precioxblister;
                        //        //obj_prod.porcentajeganancia = item.
                        //        lProductolista.Add(obj_prod);
                        //    }
                        //}
                    }
                    db.UpdateRange(precioaux);
                    await db.SaveChangesAsync();
                }
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public mensajeJson VerificarCredenciales_AprobarFactura(string usuario, string clave)
        {
            try
            {
                var empleado = db.EMPLEADO.Where(x => x.userName == usuario && x.clave == clave && x.estado != "ELIMINADO").FirstOrDefault();
                if (empleado == null)
                    return (new mensajeJson("Credenciales incorrectas", null));
                else
                {
                    return (new mensajeJson("ok", empleado.emp_codigo.ToString()));
                }

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<mensajeJson> AnularFacturaAsync(int idpreingreso, int idfactura, string jsoncuarentena, string jsonaprobado)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var objfactura = await db.PIFACTURASPREINGRESO.FindAsync(idfactura);
                    if (objfactura.estado == "APROBADO")
                    {
                        //Cambiar estado a anulado.
                        objfactura.estado = "HABILITADO";
                        objfactura.usuarioanula = user.getIdUserSession();
                        objfactura.fechaanulacion = DateTime.Now;
                        db.PIFACTURASPREINGRESO.Update(objfactura);
                        await db.SaveChangesAsync();

                        //Anular el stock lote producto creado.
                        //Anular(de forma automática) el registro de kardex generado.
                        var stockfactura = JsonConvert.DeserializeObject<List<AStockLoteProducto>>(jsonaprobado);
                        for (int i = 0; i < stockfactura.ToList().Count; i++)
                        {
                            var objPro = db.APRODUCTO.Where(x => x.idproducto == stockfactura[i].idproducto && x.estado == "HABILITADO").FirstOrDefault();
                            var cantidad = stockfactura[i]._cantidadlote;
                            if (objPro.idtipoproducto == "EC")
                            {
                                var objDetallePreIngreso = db.PIPREINGRESODETALLE.Where(x => x.idfactura == objfactura.idfactura);
                                cantidad = Convert.ToDecimal(objDetallePreIngreso.Where(x => x.idproducto == stockfactura[i].idproducto).FirstOrDefault().cantingresada);
                            }
                            //if (stockfactura[i].numfactura == (oFactura.serie + oFactura.numdoc)){}
                            var obj = new AStockLoteProducto();
                            stockfactura[i].estado = "HABILITADO";
                            stockfactura[i].edicion = obj.setedicion("ANULADO", "FacturaPreingreso", objfactura.idfactura.ToString(), cantidad.ToString());
                            stockfactura[i].candisponible -= Convert.ToInt32(cantidad);
                        }
                        db.UpdateRange(stockfactura);
                        await db.SaveChangesAsync();

                        if (jsoncuarentena != "" && jsoncuarentena != null)
                        {
                            var stockcuarentena = JsonConvert.DeserializeObject<List<AStockLoteProducto>>(jsoncuarentena);
                            for (int i = 0; i < stockcuarentena.ToList().Count; i++)
                            {
                                //if (stockfactura[i].numfactura == (oFactura.serie + oFactura.numdoc)){}
                                var obj = new AStockLoteProducto();
                                stockcuarentena[i].estado = "HABILITADO";
                                stockcuarentena[i].edicion = obj.setedicion("ANULADO", "FacturaPreingreso", objfactura.idfactura.ToString(), stockcuarentena[i]._cantidadlote.ToString());
                                stockcuarentena[i].candisponible += Convert.ToInt32(stockcuarentena[i]._cantidadlote);
                            }
                            db.UpdateRange(stockcuarentena);
                            await db.SaveChangesAsync();
                        }
                        //Los precios de LISTA, PRODUCTO, COTIZACIÓN(PENDIENTES).
                        transaccion.Commit();
                    }

                    return new mensajeJson("ok", objfactura);
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
        public async Task<mensajeJson> AnularGuiaAsync(int idpreingreso, int idfactura, string jsonaprobado)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var objfactura = await db.PIFACTURASPREINGRESO.FindAsync(idfactura);
                    if (objfactura.estado == "APROBADO")
                    {
                        objfactura.estado = "ANULADO";
                        objfactura.usuarioanula = user.getIdUserSession();
                        objfactura.fechaanulacion = DateTime.Now;
                        db.PIFACTURASPREINGRESO.Update(objfactura);
                        await db.SaveChangesAsync();

                        var stockfactura = JsonConvert.DeserializeObject<List<AStockLoteProducto>>(jsonaprobado);
                        for (int i = 0; i < stockfactura.ToList().Count; i++)
                        {
                            var objPro = db.APRODUCTO.Where(x => x.idproducto == stockfactura[i].idproducto && x.estado == "HABILITADO").FirstOrDefault();
                            var cantidad = stockfactura[i]._cantidadlote;
                            if (objPro.idtipoproducto == "EC")
                            {
                                var objDetallePreIngreso = db.PIPREINGRESODETALLE.Where(x => x.idfactura == objfactura.idfactura);
                                cantidad = Convert.ToDecimal(objDetallePreIngreso.Where(x => x.idproducto == stockfactura[i].idproducto).FirstOrDefault().cantingresada);
                            }
                            var obj = new AStockLoteProducto();
                            stockfactura[i].estado = "HABILITADO";
                            stockfactura[i].edicion = obj.setedicion("ANULACION", "FacturaPreingreso", objfactura.idfactura.ToString(), cantidad.ToString());
                            stockfactura[i].candisponible -= Convert.ToInt32(cantidad);
                        }
                        db.UpdateRange(stockfactura);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                    }

                    return new mensajeJson("ok", objfactura);
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

        public async Task<mensajeJson> ValidarAnalisisOrganolepticoAsync(int idfactura)
        {
            try
            {
                var objfactura = await db.PIFACTURASPREINGRESO.FindAsync(idfactura);
                if (objfactura != null || objfactura is not null)
                {
                    objfactura.usuariovalida = user.getIdUserSession();
                    objfactura.fechavalidacion = DateTime.Now;
                    db.Update(objfactura);
                    db.SaveChanges();
                }
                return new mensajeJson("ok", objfactura);
            }
            catch (Exception e)
            {
                return new mensajeJson("Error al validar el análisis organoléptico: " + e.Message, null);
            }
        }

        public async Task<mensajeJson> ValidarNotaDeCreditoAsync(int idfactura, string estadoNC)
        {
            try
            {
                var objfactura = await db.PIFACTURASPREINGRESO.FindAsync(idfactura);
                if (objfactura != null || objfactura is not null)
                {
                    objfactura.estadonotacredito = estadoNC;
                    objfactura.usuarionotacredito = user.getIdUserSession();
                    objfactura.fechanotacredito = DateTime.Now;
                    db.Update(objfactura);
                    db.SaveChanges();
                }
                return new mensajeJson("ok", objfactura);
            }
            catch (Exception e)
            {
                return new mensajeJson("Error al validar Nota de Crédito: " + e.Message, null);
            }
        }
    }
}
