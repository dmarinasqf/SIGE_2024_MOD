 using ENTIDADES.Almacen;
using ENTIDADES.ventas;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.EF
{
    public class VentaEF:IVentaEF
    {
        private readonly Modelo db;
        private readonly IUser  user;
        
        public VentaEF(Modelo _db, IUser _user)
        {
            db = _db;
            user = _user;
        }

        public async Task<mensajeJson> RegistrarVentaDirectaAsync(Venta venta) {
            using (var transaccion = db.Database.BeginTransaction()) {
                try {
                    var pagos = JsonConvert.DeserializeObject<List<VentaPagos>>(venta.jsonpagos);
                    NumToLetter monedatext = new NumToLetter();
                    //obtener correlativo de documento
                    var aperturacaja = db.APERTURACAJA.Find(venta.idaperturacaja);
                    if (aperturacaja.estado != "APERTURADA")
                        return new mensajeJson("La caja ha sido cerrada.", null);

                    var idcajasucursal = aperturacaja.idcajasucursal;
                    if (user.getIdSucursalCookie() == 159)//CALL CENTER
                        idcajasucursal = venta.idcajasucursal;

                    var cajacorrelativo = db.CAJASUCURSAL.Find(idcajasucursal);
                    //verificar si esta asociado a otra caja
                    if (cajacorrelativo.correlativoasociadoaotracaja.HasValue && cajacorrelativo.correlativoasociadoaotracaja.Value)
                        cajacorrelativo = db.CAJASUCURSAL.Find(cajacorrelativo.idcajacorrelativoasociado);

                    if (user.getIdSucursalCookie() == 159)//CALL CENTER
                        venta.idsucursal = cajacorrelativo.idsucursal;

                    var correlativo = db.CORRELATIVODOCUMENTO.Where(x => x.iddocumento == venta.iddocumento && x.idcajasucursal == cajacorrelativo.idcajasucursal).FirstOrDefault();
                    if (correlativo is null)
                        return new mensajeJson("La caja no tiene asignado correlativos para el documento seleccionado", null);


                    //verificar si tiene credito 
                    if (venta.idcliente is not null) {
                        var res = VerificarSiTieneCredito(pagos, venta.idcliente.Value);
                        if (res is not "ok") {
                            return new mensajeJson(res, null);
                        }
                    }

                    var correlativoactual = correlativo.actual + 1;
                    AgregarCeros ceros = new AgregarCeros();
                    venta.numdocumento = ceros.agregarCeros(correlativoactual.Value);
                    venta.serie = correlativo.serie;

                    //VALIDAR NUMDOCUMENTO UNICO
                    if (db.VENTA.Where(x => x.serie == venta.serie && x.numdocumento == venta.numdocumento && x.idempresa == venta.idempresa).Any())
                        return new mensajeJson($"Ya se encuentra registrado un documento con el número {venta.serie} {venta.numdocumento}", null);

                    if (venta.fecha is null)
                        venta.fecha = DateTime.Now;
                    venta.estado = "HABILITADO";
                    venta.ismanual = false;
                    venta.textomoneda = monedatext.NumeroALetras(venta.total.Value, db.FMONEDA.Find(100000).codigosunat);
                    
                    //actualizar correlativo
                    correlativo.actual += 1;
                    correlativo.iseditable = false;
                    db.Update(correlativo);
                    await db.SaveChangesAsync();
                    //guardar cabecera

                    db.VENTA.Add(venta);
                    await db.SaveChangesAsync();
                    //guardar pago
                    if (pagos.Count > 0) {
                        for (int i = 0; i < pagos.Count; i++) {
                            pagos[i].idventa = venta.idventa;
                            pagos[i].estado = "HABILITADO";
                            if (pagos[i].montopagado is null) pagos[i].montopagado = pagos[i].total ?? 0;
                        }
                        db.VENTAPAGOS.AddRange(pagos);
                        await db.SaveChangesAsync();
                    }

                    if (venta.idguiasSalidas is not null)
                    {
                        var idguias = venta.idguiasSalidas.Split('_');
                        for (int i = 0; i < idguias.Length; i++)
                        {
                            int idguia = Convert.ToInt32(idguias[i]);
                            var objGuiaSalida = db.AGUIASALIDA.Where(x => x.idguiasalida == idguia).FirstOrDefault();
                            if (objGuiaSalida != null)
                            {
                                objGuiaSalida.idventa = Convert.ToInt32(venta.idventa);
                                db.AGUIASALIDA.Update(objGuiaSalida);
                                db.SaveChanges();
                            }
                        }
                    }

                    var detalle = JsonConvert.DeserializeObject<List<VentaDetalle>>(venta.jsondetalle);
                    foreach (var detallePedido in detalle)
                    {
                        if (detallePedido.idpromopack.HasValue)
                        {
                            int idVentaPro = (int)venta.idtablaventapor.Value;
                            int idpromopack = detallePedido.idpromopack.Value;
                            var idpackventapedido = db.DETALLEPACKPEDIDOVENTA.Where(pp => pp.idpromopack == idpromopack && pp.idpedido_codigo == idVentaPro).Select(pp => pp.idpackPedidoVenta).FirstOrDefault();                       
                            detallePedido.idpackPedidoVenta = idpackventapedido; // Si precio es nulo, asigna 0
                        }
                    }
                    //guardar detalle
                    for (int i = 0; i < detalle.Count; i++) {
                        detalle[i].idventa = venta.idventa;
                        if (detalle[i].precio == 0.01m || detalle[i].precioigv == 0.01m) {
                            detalle[i].precio = 0;
                            detalle[i].precioigv = 0;
                        }
                    }

                    db.AddRange(detalle);
                    await db.SaveChangesAsync();
                    //actualizar proforma, pedido
                    if (venta.ventapor is not null && venta.idtablaventapor is not null)
                        await actualizarOtroRegistroPorTipoVentaAsync(venta);

                    transaccion.Commit();
                    return new mensajeJson("ok", venta);

                }
                catch (Exception e) {

                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        return new mensajeJson(e.InnerException.Message, null);
                    else
                        return new mensajeJson(e.Message, null);
                }
            }

        }
        public async Task<mensajeJson> RegistrarVentaManualAsync(Venta venta)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {   
                    var pagos = JsonConvert.DeserializeObject<List<VentaPagos>>(venta.jsonpagos);
                    var ventaexists = db.VENTA.Where(x => x.serie == venta.serie && x.numdocumento == venta.numdocumento ).Any();
                    if (ventaexists)
                        return new mensajeJson("El correlativo ingresado ya ha sido registrado", null);

                    if (venta.idcliente is not null)
                    {
                        var res = VerificarSiTieneCredito(pagos, venta.idcliente.Value);
                        if (res is not "ok")
                        {
                            return new mensajeJson(res, null);
                        }
                    }
                   
                    NumToLetter monedatext = new NumToLetter();                                                        
                    AgregarCeros ceros = new AgregarCeros();
                    if (venta.fecha is null)
                        venta.fecha = DateTime.Now;
                    venta.estado = "HABILITADO";

                    venta.textomoneda = monedatext.NumeroALetras(venta.total.Value, db.FMONEDA.Find(pagos[0].idmoneda).codigosunat);
                    //guardar cabecera
                    venta.ismanual = true;
                    //validar serie y numdocumento
                    if (venta.serie.Length != 4)
                        return new mensajeJson("La serie debe tener 4 digitos", null);
                    if (venta.numdocumento.Length != 8)
                        venta.numdocumento = ceros.agregarCeros(int.Parse(venta.numdocumento));

                    //VALIDAR NUMDOCUMENTO UNICO
                    if (db.VENTA.Where(x => x.serie == venta.serie && x.numdocumento == venta.numdocumento && x.idempresa == venta.idempresa).Any())
                        return new mensajeJson($"Ya se encuentra registrado un documento con el número {venta.serie} {venta.numdocumento}", null);

                    db.VENTA.Add(venta);
                    await db.SaveChangesAsync();
                    //guardar pago
                    for (int i = 0; i < pagos.Count; i++)
                    {
                        pagos[i].idventa = venta.idventa;
                        pagos[i].estado = "HABILITADO";
                        if (pagos[i].montopagado is null) pagos[i].montopagado = pagos[i].total ?? 0;
                    }
                    db.VENTAPAGOS.AddRange(pagos);
                    await db.SaveChangesAsync();

                    var detalle = JsonConvert.DeserializeObject<List<VentaDetalle>>(venta.jsondetalle);
                    //guardar detalle
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        detalle[i].idventa = venta.idventa;
                        if (detalle[i].precio == 0.01m || detalle[i].precioigv == 0.01m)
                        {
                            detalle[i].precio = 0;
                            detalle[i].precioigv = 0;
                        }
                    }

                    db.AddRange(detalle);
                    await db.SaveChangesAsync();
                    //actualizar proforma, pedido
                    if (venta.ventapor is not null && venta.idtablaventapor is not null)
                        await actualizarOtroRegistroPorTipoVentaAsync(venta);
                   
                    transaccion.Commit();
                    return new mensajeJson("ok", venta);

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
        public async Task<mensajeJson> AnularVenta(long idventa)
        {
            using (var transaccion= db.Database.BeginTransaction())
            {
                try
                {
                    var venta = db.VENTA.Find(idventa);
                    if (venta.fecha.Value.Date != DateTime.Now.Date)
                        return new mensajeJson("Ha pasado la fecha para anular la venta, realize una nota de crédito. ", null);
                    var cajaa = db.APERTURACAJA.Find(venta.idaperturacaja);
                    if (cajaa.estado != "APERTURADA")
                        return new mensajeJson("La caja ya ha sido cerrada", null);
                    venta.estado = "ANULADO";
                    venta.fechaanulacion = DateTime.Now;
                    venta.usuarioanula = user.getIdUserSession();
                    db.Update(venta);
                    await db.SaveChangesAsync();
                    var restaurarstock = devolverstockdeventa(idventa);
                    if (restaurarstock != "ok")
                    {
                        transaccion.Rollback();
                        return new mensajeJson("Error al descargar stock. "+ restaurarstock, null);
                    }
                    var archivodelete = eliminartxthorizont(venta);
                    if(archivodelete!="ok")
                    {
                        transaccion.Rollback();
                        return new mensajeJson(archivodelete, null);
                    }

                    transaccion.Commit();
                    return new mensajeJson("ok", null);

                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }
            
        }
        public string devolverstockdeventa(long idventa)
        {
            try
            {
                var detalle = db.VENTADETLLE.Where(x => x.idventa == idventa && x.estado == "HABILITADO").ToList();
                for (int i = 0; i < detalle.Count; i++)
                {
                    var stock = new AStockLoteProducto();
                    stock = db.ASTOCKPRODUCTOLOTE.Find(detalle[i].idstock);
                    stock.multiplo = stock.multiplo ?? 1;
                    stock.multiploblister = stock.multiploblister ?? 1;
                    if (stock.multiplo is 0) stock.multiplo = 1;
                    if (stock.multiploblister is 0) stock.multiploblister = 1;
                    if (detalle[i].isfraccion.HasValue &&  detalle[i].isfraccion.Value)
                    {
                        stock.candisponible += detalle[i].cantidad;
                    }
                    else if (detalle[i].isblister.HasValue && detalle[i].isblister.Value)
                    {
                        stock.candisponible += (stock.multiplo??1 / stock.multiploblister??1) * detalle[i].cantidad;
                    }
                    else
                        stock.candisponible += detalle[i].cantidad * stock.multiplo??1;

                    //stock.acciones=stock.setedicion("INGRESO", "DetalleNotaCD","")
                    detalle[i].estado = "ANULADO";
                    
                    db.Update(stock);
                    db.SaveChanges();
                }
                db.UpdateRange(detalle);
                db.SaveChanges();
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }

        }
        private async Task<string> actualizarOtroRegistroPorTipoVentaAsync(Venta venta) {
            if (venta.ventapor is null)
                return "ok";
            if (venta.ventapor == "proforma" && venta.idtablaventapor is not null) {
                var proforma = db.PROFORMA.Find(venta.idtablaventapor);
                if (proforma != null) {
                    proforma.estado = "APLICADO";
                    proforma.iseditable = false;
                    db.Update(proforma);
                    await db.SaveChangesAsync();
                }
            }
            else if (venta.ventapor == "pedido" && venta.idtablaventapor is not null) {
                var pedido = await db.PEDIDO.FindAsync((int)venta.idtablaventapor);
                if (pedido is null)
                    return "No existe pedido";
                pedido.numboleta = venta.serie + venta.numdocumento;
                pedido.iseditable = false;
                pedido.facturado = 1;
                db.Update(pedido);
                await db.SaveChangesAsync();

            }
            return "ok";
        }
        private string eliminartxthorizont(Venta venta)
        {           
            try
            {
                var sucursal = venta.idsucursal;
                var rucempresa = db.EMPRESA.Find(venta.idempresa).ruc;
                var docsunat = db.FDOCUMENTOTRIBUTARIO.Find(venta.iddocumento).codigosunat;
                var nombretxt = rucempresa + "-" + docsunat + "-" + venta.serie + "-" + venta.numdocumento + ".txt";
                var path = db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor;
                path = path + sucursal.ToString() + "\\" + nombretxt;
                
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
          
        }
        private string VerificarSiTieneCredito(List<VentaPagos> pagos, int idcliente)
        {
            var credito = db.FTIPOPAGO.Where(x => x.descripcion == "CREDITO").FirstOrDefault();
            if (credito is null)
                return "ok";
            var tienecredito = pagos.Where(x => x.idtipopago == credito.idtipopago).ToList();
            if (tienecredito.Count == 0)
                return "ok";
            var total = tienecredito.Sum(x => x.montopagado);
            var lineacredito = db.FLINEACREDITO.Find(idcliente);
            if (lineacredito is null)
                return "El cliente no tiene linea de crédito";
            if (lineacredito.isbloqueado)
                return "La linea de crédito del cliente esta bloqueada";
            if (lineacredito.montoactual < total)
                return "El total de la venta sobrepasa el crédito del cliente";
            return "ok";
        }

        public string[] ObtenerUltimoSerieNumDocumentoManual(int idsucursal)
        {
            string[] serienumdocumento = new string[2];
            var oUltimaVenta = db.VENTA.Where(x => x.idsucursal == idsucursal && x.estado == "HABILITADO").OrderByDescending(x => x.fecha).FirstOrDefault();
            if (oUltimaVenta != null)
            {
                string[] seriesplit = new string[4];
                seriesplit[0] = "0";
                seriesplit[1] = "0";
                seriesplit[2] = oUltimaVenta.serie.Substring(2, 1);
                seriesplit[3] = oUltimaVenta.serie.Substring(3, 1);
                string serieModificada = seriesplit[0] + seriesplit[1] + seriesplit[2] + seriesplit[3];
                string numDocumentoModificado;
                var oUltimaVentaSerieCambiado = db.VENTA.Where(x => x.serie == serieModificada && x.idsucursal == idsucursal && x.estado == "HABILITADO").OrderByDescending(x => x.fecha).FirstOrDefault();
                serienumdocumento[0] = serieModificada;
                if (oUltimaVentaSerieCambiado != null)
                {
                    AgregarCeros cerosI = new AgregarCeros();
                    int intNumdocumento = Convert.ToInt32(oUltimaVentaSerieCambiado.numdocumento);
                    intNumdocumento += 1;
                    numDocumentoModificado = intNumdocumento.ToString();
                    if (numDocumentoModificado.Length != 8)
                        numDocumentoModificado = cerosI.agregarCeros(int.Parse(numDocumentoModificado));
                }
                else
                {
                    numDocumentoModificado = "00000001";
                }
                serienumdocumento[1] = numDocumentoModificado;
            }
            return serienumdocumento;
        }
    }
}
