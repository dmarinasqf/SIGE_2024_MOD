using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Math;
using ENTIDADES.Almacen;
using ENTIDADES.gdp;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
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
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES.ventas;
using Erp.Entidades.Almacen;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class GuiaSalidaEF : IGuiaSalidaEF
    {
        private readonly Modelo db;
        private readonly IUser user;


        public GuiaSalidaEF(Modelo context,IUser _user)
        {
            db = context;
            user = _user;
        }

        public async Task<List<AGuiaSalida>> ListarAsync()
        {
            return (await db.AGUIASALIDA.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }

        public async Task<mensajeJson> AuditoriaGuiaRegistrarEditarAsync(AGuiaSalida obj, string detalle)
        {

            try
            {
                List<ADetalleGuiaSalida> detalleguia = new List<ADetalleGuiaSalida>();
                detalleguia = JsonConvert.DeserializeObject<List<ADetalleGuiaSalida>>(detalle);
                if (obj.idguiasalida == 0)
                {
                    using (var transaccion = await db.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            await db.AGUIASALIDA.AddAsync(obj);
                            await db.SaveChangesAsync();
                            await db.ADETALLEGUIASALIDA.AddRangeAsync(detalleguia);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        catch (Exception e)
                        {
                            await transaccion.RollbackAsync();
                            return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
                        }
                    }
                }
                else
                    return await EditarAuditoriaGuia(obj, detalleguia);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
            }
        }
        public async Task<mensajeJson> EditarAuditoriaGuia(AGuiaSalida guia, List<ADetalleGuiaSalida> detalle)
        {
            using (var transaccion = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    var aux = await db.AGUIASALIDA.FindAsync(guia.idguiasalida);
                    if (aux != null)
                    {
                        aux.idalmacensucursaldestino = guia.idalmacensucursaldestino;
                        aux.estadoguia = guia.estadoguia;
                        aux.fechatraslado = guia.fechatraslado;
                        aux.idempresatransporte = guia.idempresatransporte;
                        aux.idvehiculo = guia.idvehiculo;
                        aux.observacion = guia.observacion;
                        aux.idempleadoaudita = guia.idempleadoaudita;
                        aux.idempleadomantenimiento = guia.idempleadomantenimiento;
                        aux.bultos = guia.bultos;
                        aux.peso_total = guia.peso_total;
                        if (aux.idempleadoaudita is null)
                            aux.idempleadoaudita = user.getIdUserSession();
                        db.AGUIASALIDA.Update(aux);
                        await db.SaveChangesAsync();
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            var itemaux = await db.ADETALLEGUIASALIDA.FindAsync(detalle[i].iddetalleguiasalida);
                            if (itemaux != null)
                            {
                                itemaux.cantidadpicking = detalle[i].cantidadpicking;
                                itemaux.estado = detalle[i].estado;
                                db.ADETALLEGUIASALIDA.Update(itemaux);
                                await db.SaveChangesAsync();
                            }
                        }
                        await transaccion.CommitAsync();
                        return new mensajeJson("ok", null);
                    }
                    else
                    {
                        await transaccion.RollbackAsync();
                        return new mensajeJson("notfound", null);
                    }

                }
                catch (Exception e)
                {
                    await transaccion.RollbackAsync();
                    return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
                }
            }
        }

        public async Task<mensajeJson> GenerarListaGuiaSalida(string listaguiasalidajson, string listasucusalesjson)
        {
            int count = 0;
            int iddistribuciongenerado = 0;
            decimal divisibilidad = 1;
          
            AGuiaSalida guiasalida = new AGuiaSalida();
            ADristribucionProducto guiadistribucione= new ADristribucionProducto();
            AGuiaSalida guiasalidan = new AGuiaSalida();
            ADetalleGuiaSalida detalleguia = new ADetalleGuiaSalida();

            // Deserializar la cadena JSON de la sucursal
            dynamic sucursalJson = JsonConvert.DeserializeObject(listasucusalesjson);

            // Obtener los valores de la cadena JSON
            int idsucursalorigen = sucursalJson.idsucursal;
            int usuariocreacion = sucursalJson.idempleado;
            int idempresaorigen = sucursalJson.idempresa;
            using (var transaccion = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    List<AGuiaSalida> listaguias = JsonConvert.DeserializeObject<List<AGuiaSalida>>(listaguiasalidajson);

                    if (listaguias.Count > 0)
                    {
                        // Take the first element from the list
                        AGuiaSalida guia = listaguias[0];

                        // Create a new instance of ADristribucion
                        ADristribucionProducto guiadistribucion = new ADristribucionProducto();

                        // Suponiendo que guiadistribucion.Fechacreacion es de tipo DateTime
                        guiadistribucion.Fechacreacion = DateTime.Now.AddMonths(1);


                        // Placeholder values for other properties
                        guiadistribucion.idsucursalorigen = idsucursalorigen; //guia.idalmacensucursalorigen;
                        guiadistribucion.idempresaorigen = idempresaorigen; //guia.idempresa;
                        guiadistribucion.usuariocreacion = usuariocreacion; // Replace with the actual value
                        guiadistribucion.estado = 1; // Replace with the actual value
                        db.ADristribucionProducto.Add(guiadistribucion);
                        await db.SaveChangesAsync();
                        // Assign the IdDistribucion to AGuiaSalida
                        iddistribuciongenerado = guiadistribucion.IdDistribucion;

                        // Rest of your code...
                    }
                    // Assuming you want to set the creation date to the current date and time
          

                    string idguiassalidas = "";
                    int contadorExterno = 0;
                    //hacer un for y separar los detalles 
                    for (int i = 0; i < listaguias.Count; i++)
                    {
                        if (listaguias[i] != null) {
                            List<ADetalleGuiaSalida> detalle = JsonConvert.DeserializeObject<List<ADetalleGuiaSalida>>(listaguias[i].jsondetalle);
                            //count detalle cuenta el detalle por cada uno
                            if (detalle is not null)
                            {
                                count = 0;
                                int mult = detalle.Count / 20;
                                int res = detalle.Count % 20;
                                for (int x = 0; x <= mult; x++)
                                {
                                    int rf = 0;
                                    if (x == mult)
                                    {
                                        rf = (mult * 20) + res;
                                        count = 0;
                                    }
                                    else
                                    {
                                        rf = (x + 1) * 20;
                                        count = 0;
                                    }
                                    


                                    //for (int j = 0; j < detalle.Count; j++)
                                    for (int j = x * 20; j < rf; j++)
                                    {
                                        //obtiene las cantidades separadas por lote con stock
                                        var detallestockdistribuir = new List<ADetalleGuiaSalida>();
                                        if (detalle[j].idstock != 0 && listaguias[i].idtipoguia == 3)
                                            detallestockdistribuir.Add(detalle[j]);
                                        else
                                            detallestockdistribuir = await GenerarDetalleGuiaDistribucion(detalle[j].cantidadgenerada, detalle[j].idproducto, listaguias[i]);
                                        
                                        //if(detalle.Count)
                                        if (detallestockdistribuir is not null)
                                        {
                                            for (int k = 0; k < detallestockdistribuir.Count; k++)
                                            {
                                                //crea guiaas con n digitos
                                                divisibilidad = count % 30;
                                                if (divisibilidad == 0)
                                                {
                                                    guiasalida = new AGuiaSalida();
                                                    guiasalida = listaguias[i];
                                                    guiasalida.idguiasalida = 0;//resetea el id 
                                                    guiasalida.codigo = await generarcodigoAsync(listaguias[i].idempresa);
                                                    guiasalida.ano = DateTime.Now.Year;
                                                    guiasalida.estado = "HABILITADO";
                                                    guiasalida.estadoguia = "PENDIENTE";
                                                    guiasalida.IdDistribucion = iddistribuciongenerado;
                                                    await db.AGUIASALIDA.AddAsync(guiasalida);
                                                    await db.SaveChangesAsync();
                                                    contadorExterno++;

                                                    if (contadorExterno == 1)
                                                        idguiassalidas += guiasalida.idguiasalida;
                                                    else
                                                        idguiassalidas += "_" + guiasalida.idguiasalida;
                                                }

                                                detalleguia = new ADetalleGuiaSalida();
                                                detalleguia = detallestockdistribuir[k];
                                                //aca usa el id de la guia de salida
                                                detalleguia.idguiasalida = guiasalida.idguiasalida;
                                                await db.ADETALLEGUIASALIDA.AddAsync(detalleguia);
                                                await db.SaveChangesAsync();
                                                count++;
                                            }

                                            //db.ADETALLEGUIASALIDA.AddRange(detallestockdistribuir);
                                            //await db.SaveChangesAsync();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    await transaccion.CommitAsync();
                    return new mensajeJson("ok", idguiassalidas);
                }
                catch (Exception e)
                {
                    string msj = "";
                    try
                    {
                        msj = e.InnerException.Message;
                    }
                    catch (Exception) { msj = ""; }
                    await transaccion.RollbackAsync();
                    return new mensajeJson(e.Message + "-" + msj, null);
                }
            }
        }
        //agrega el idstock al detalle de la guia
        public async Task<List<ADetalleGuiaSalida>> GenerarDetalleGuiaDistribucion(int cantidad, int idproducto, AGuiaSalida guiasalida)
        {
            ADetalleGuiaSalida detalleguia = new ADetalleGuiaSalida();
            detalleguia = new ADetalleGuiaSalida();
            int cajadisponiblestocklote = 0;
            int faltante = 0;
            int enstock = 0;

            List<ADetalleGuiaSalida> lista = new List<ADetalleGuiaSalida>();
            var producto = await db.APRODUCTO.FindAsync(idproducto);
            int multiplo = 0;
            try { multiplo = int.Parse(producto.multiplo.ToString()); }
            catch (Exception) { multiplo = 1; }

            int stockenviar = cantidad;
            faltante = stockenviar;
            List<AStockLoteProducto> listastock = new List<AStockLoteProducto>();
            listastock = await db.ASTOCKPRODUCTOLOTE
                .Where(x => x.idproducto == idproducto && x.idalmacensucursal == guiasalida.idalmacensucursalorigen && x.candisponible>0)
                .OrderBy(x => x.fechavencimiento).ToListAsync();
            for (int i = 0; i < listastock.Count(); i++)
            {
                if (listastock[i].candisponible == 0)
                    cajadisponiblestocklote = 0;
                else
                {
                    //transformo la cantidad a cajas
                    decimal res = listastock[i].candisponible.Value / multiplo;
                    cajadisponiblestocklote = Convert.ToInt32(Math.Truncate(res));
                    if (faltante <= cajadisponiblestocklote)
                    {
                        enstock = faltante;
                        detalleguia = new ADetalleGuiaSalida();
                        detalleguia.cantidadgenerada = faltante;
                        detalleguia.idproducto = idproducto;
                        detalleguia.idstock = listastock[i].idstock;
                        detalleguia.idguiasalida = 0;
                        detalleguia.estado = "HABILITADO";
                        lista.Add(detalleguia);
                        faltante = 0;
                        break;
                    }
                    else if (cajadisponiblestocklote > 0)
                    {
                        enstock += cajadisponiblestocklote;
                        faltante -= cajadisponiblestocklote;
                        detalleguia = new ADetalleGuiaSalida();
                        detalleguia.cantidadgenerada = cajadisponiblestocklote;
                        detalleguia.idproducto = idproducto;
                        detalleguia.idstock = listastock[i].idstock;
                        detalleguia.idguiasalida = 0;
                        detalleguia.estado = "HABILITADO";
                        lista.Add(detalleguia);
                    }
                }
            }
            return lista;

        }

        public async Task<mensajeJson> RegistrarGuiaSalidaDesdeVentas(Venta venta)
        {
            using (var transaccion = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    var objGuiaSalida = db.AGUIASALIDA.Where(x => x.idventa == venta.idventa && x.estado == "HABILITADO").FirstOrDefault();
                    if (objGuiaSalida != null)
                    {
                        var lGuiasSalida = db.AGUIASALIDA.Where(x => x.idventa == venta.idventa).ToList();
                        List<string[]> lGuiasReturn = new List<string[]>();
                        for (var i = 0; i < lGuiasSalida.Count; i++)
                        {
                            string[] oION = { "0", lGuiasSalida[i].idguiasalida.ToString(), "0" };
                            lGuiasReturn.Add(oION);
                        }
                        return new mensajeJson("La venta ya contiene una guia generada.", JsonConvert.SerializeObject(lGuiasReturn));
                    }

                    var objInterno = db.VENTA.Where(x => x.idventa == venta.idventa).FirstOrDefault();
                    venta.idsucursal = objInterno.idsucursal;
                    venta.idempresa = objInterno.idempresa;
                    venta.idempleado = objInterno.idempleado;
                    
                    var objcorrelativo = db.CORRELATIVODOCUMENTO.Where(x => x.idcorrelativo == venta.idcorrelativo).FirstOrDefault();
                    if (objcorrelativo is null)
                        return new mensajeJson("Error al buscar la serie de guia.", null);

                    if (venta.jsondetalle is null)
                        venta.jsondetalle = JsonConvert.SerializeObject(db.VENTADETLLE.Where(x => x.idventa == venta.idventa));

                    var detalle = JsonConvert.DeserializeObject<List<VentaDetalle>>(venta.jsondetalle);
                    var idalmacensucursalorigen = 0;
                    List<string[]> lTipoPorductoIdGuiaNumDetalle = new List<string[]>();
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        var objProducto = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).FirstOrDefault();
                        if (objProducto.idproducto != 11956)//Gasto de Envio
                        {
                            if (objProducto.idtipoproducto == "IM" || objProducto.idtipoproducto == "IS")
                                objProducto.idtipoproducto = "IMIS";

                            if (objProducto.idtipoproducto == "PT" || objProducto.idtipoproducto == "FM")
                                objProducto.idtipoproducto = "PTFM";

                            var oListaTPIN = lTipoPorductoIdGuiaNumDetalle.Where(x => x[0] == objProducto.idtipoproducto && x[2] != "20").FirstOrDefault();
                            if (oListaTPIN is null)
                            {
                                var idalmacensuc = db.ASTOCKPRODUCTOLOTE.Where(x => x.idstock == detalle[i].idstock).Select(x => x.idalmacensucursal).FirstOrDefault();
                                idalmacensucursalorigen = (int)idalmacensuc;

                                AGuiaSalida oGuiaSalida = new();
                                oGuiaSalida.codigo = await generarcodigoAsync(venta.idempresa);
                                oGuiaSalida.fechatraslado = DateTime.Now;
                                oGuiaSalida.idsucursal = venta.idsucursal;
                                oGuiaSalida.idalmacensucursalorigen = idalmacensucursalorigen;
                                oGuiaSalida.idempresa = venta.idempresa;
                                oGuiaSalida.seriedoc = objcorrelativo.serie;
                                oGuiaSalida.estado = "HABILITADO";
                                oGuiaSalida.estadoguia = "ENTREGADO";
                                oGuiaSalida.idtipoguia = 4;//GUIA CLIENTE
                                oGuiaSalida.idventa = (int)venta.idventa;
                                oGuiaSalida.ano = DateTime.Now.Year;
                                oGuiaSalida.idcaja = 1;
                                oGuiaSalida.idcorrelativo = objcorrelativo.idcorrelativo;
                                oGuiaSalida.idguiasalida = 0;
                                oGuiaSalida.observacion = "";
                                oGuiaSalida.idempresatransporte = 1000;
                                oGuiaSalida.idvehiculo = 1000;
                                oGuiaSalida.idcliente = objInterno.idcliente;
                                oGuiaSalida.fechatraslado = venta.fechatraslado;
                                oGuiaSalida.peso_total = venta.peso;
                                oGuiaSalida.bultos = venta.bulto;
                                await db.AddAsync(oGuiaSalida);
                                await db.SaveChangesAsync();
                                string[] oION = { objProducto.idtipoproducto, oGuiaSalida.idguiasalida.ToString(), "0" };
                                lTipoPorductoIdGuiaNumDetalle.Add(oION);
                                oListaTPIN = oION;
                            }

                            ADetalleGuiaSalida oDetalleGuiaSalida = new();
                            oDetalleGuiaSalida.iddetalleguiasalida = 0;
                            oDetalleGuiaSalida.idproducto = (int)detalle[i].idproducto;
                            oDetalleGuiaSalida.idstock = (int)detalle[i].idstock;
                            oDetalleGuiaSalida.cantidadgenerada = (int)detalle[i].cantidad;
                            oDetalleGuiaSalida.cantidadpicking = (int)detalle[i].cantidad;
                            oDetalleGuiaSalida.estado = "HABILITADO";
                            oDetalleGuiaSalida.idguiasalida = Convert.ToInt32(oListaTPIN[1]);
                            await db.AddAsync(oDetalleGuiaSalida);
                            await db.SaveChangesAsync();
                            oListaTPIN[2] = Convert.ToString(Convert.ToInt32(oListaTPIN[2]) + 1);
                        }
                    }

                    await transaccion.CommitAsync();
                    return new mensajeJson("ok", JsonConvert.SerializeObject(lTipoPorductoIdGuiaNumDetalle));
                }
                catch (Exception e)
                {
                    await transaccion.RollbackAsync();
                    return new mensajeJson(e.Message, null);
                }
            }
        }

        public async Task<mensajeJson> RegistrarGuiaCliente(string listaguiasalidajson, string listasucusalesjson)
        {
            int iddistribuciongenerado = 0;
            AGuiaSalida guiasalida = new AGuiaSalida();
            ADristribucionProducto guiadistribucione = new ADristribucionProducto();
            AGuiaSalida guiasalidan = new AGuiaSalida();
            ADetalleGuiaSalida detalleguia = new ADetalleGuiaSalida();

            dynamic sucursalJson = JsonConvert.DeserializeObject(listasucusalesjson);
            int idsucursalorigen = sucursalJson.idsucursal;
            int usuariocreacion = sucursalJson.idempleado;
            int idempresaorigen = sucursalJson.idempresa;
            using (var transaccion = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    List<AGuiaSalida> listaguias = JsonConvert.DeserializeObject<List<AGuiaSalida>>(listaguiasalidajson);
                    if (listaguias.Count > 0)
                    {
                        AGuiaSalida guia = listaguias[0];
                        ADristribucionProducto guiadistribucion = new ADristribucionProducto();
                        guiadistribucion.Fechacreacion = DateTime.Now.AddMonths(1);
                        guiadistribucion.idsucursalorigen = idsucursalorigen;
                        guiadistribucion.idempresaorigen = idempresaorigen;
                        guiadistribucion.usuariocreacion = usuariocreacion;
                        guiadistribucion.estado = 1;
                        db.ADristribucionProducto.Add(guiadistribucion);
                        await db.SaveChangesAsync();
                        iddistribuciongenerado = guiadistribucion.IdDistribucion;
                    }

                    var detalle = JsonConvert.DeserializeObject<List<ADetalleGuiaSalida>>(listaguias[0].jsondetalle);
                    List<string[]> lTipoPorductoIdGuiaNumDetalle = new List<string[]>();
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        var objProducto = db.APRODUCTO.Where(x => x.idproducto == detalle[i].idproducto).FirstOrDefault();
                        if (objProducto.idproducto != 11956)//Gasto de Envio
                        {
                            if (objProducto.idtipoproducto == "IM" || objProducto.idtipoproducto == "IS")
                                objProducto.idtipoproducto = "IMIS";

                            if (objProducto.idtipoproducto == "PT" || objProducto.idtipoproducto == "FM")
                                objProducto.idtipoproducto = "PTFM";

                            var oListaTPIN = lTipoPorductoIdGuiaNumDetalle.Where(x => x[0] == objProducto.idtipoproducto && x[2] != "20").FirstOrDefault();
                            if (oListaTPIN is null)
                            {
                                AGuiaSalida oGuiaSalida = new();
                                oGuiaSalida.idguiasalida = 0;
                                oGuiaSalida.codigo = await generarcodigoAsync(listaguias[0].idempresa);
                                oGuiaSalida.ano = DateTime.Now.Year;
                                oGuiaSalida.estado = "HABILITADO";
                                oGuiaSalida.estadoguia = "PENDIENTE";
                                oGuiaSalida.IdDistribucion = iddistribuciongenerado;
                                oGuiaSalida.fechatraslado = Convert.ToDateTime(listaguias[0].fechatraslado);
                                oGuiaSalida.idalmacensucursalorigen = listaguias[0].idalmacensucursalorigen;
                                oGuiaSalida.idcaja = listaguias[0].idcaja;
                                oGuiaSalida.idcliente = listaguias[0].idcliente;
                                oGuiaSalida.idcorrelativo = listaguias[0].idcorrelativo;
                                oGuiaSalida.idempresa = listaguias[0].idempresa;
                                oGuiaSalida.idsucursal = listaguias[0].idsucursal;
                                oGuiaSalida.idtipoguia = listaguias[0].idtipoguia;
                                oGuiaSalida.seriedoc = listaguias[0].seriedoc;
                                await db.AddAsync(oGuiaSalida);
                                await db.SaveChangesAsync();
                                string[] oION = { objProducto.idtipoproducto, oGuiaSalida.idguiasalida.ToString(), "0" };
                                lTipoPorductoIdGuiaNumDetalle.Add(oION);
                                oListaTPIN = oION;
                            }

                            ADetalleGuiaSalida oDetalleGuiaSalida = new();
                            oDetalleGuiaSalida.iddetalleguiasalida = 0;
                            oDetalleGuiaSalida.idproducto = (int)detalle[i].idproducto;
                            oDetalleGuiaSalida.idstock = (int)detalle[i].idstock;
                            oDetalleGuiaSalida.cantidadgenerada = (int)detalle[i].cantidadgenerada;
                            oDetalleGuiaSalida.cantidadpicking = (int)detalle[i].cantidadgenerada;
                            oDetalleGuiaSalida.estado = "HABILITADO";
                            oDetalleGuiaSalida.idguiasalida = Convert.ToInt32(oListaTPIN[1]);
                            await db.AddAsync(oDetalleGuiaSalida);
                            await db.SaveChangesAsync();
                            oListaTPIN[2] = Convert.ToString(Convert.ToInt32(oListaTPIN[2]) + 1);

                            if (detalle[i].lotecliente != "" && detalle[i].fechavencimientocliente != "")
                            {
                                ALoteFechaVencimientoGuiaSalida oLoteFechaVencimientoGuiaSalida = new();
                                oLoteFechaVencimientoGuiaSalida.iddetalleguiasalida = oDetalleGuiaSalida.iddetalleguiasalida;
                                oLoteFechaVencimientoGuiaSalida.lote = detalle[i].lotecliente;
                                oLoteFechaVencimientoGuiaSalida.fechavencimiento = Convert.ToDateTime(detalle[i].fechavencimientocliente);
                                oLoteFechaVencimientoGuiaSalida.estado = 1;
                                await db.AddAsync(oLoteFechaVencimientoGuiaSalida);
                                await db.SaveChangesAsync();
                            }
                        }
                    }

                    await transaccion.CommitAsync();

                    string idguiassalidas = "";
                    if (lTipoPorductoIdGuiaNumDetalle.Count() > 0)
                    {
                        for (int i = 0; i < lTipoPorductoIdGuiaNumDetalle.Count(); i++)
                        {
                            if (i == 0)
                                idguiassalidas = lTipoPorductoIdGuiaNumDetalle[i][1];
                            else
                                idguiassalidas += "_" + lTipoPorductoIdGuiaNumDetalle[i][1];
                        }
                    }
                    else
                        idguiassalidas = lTipoPorductoIdGuiaNumDetalle[0][1];

                    return new mensajeJson("ok", idguiassalidas);
                }
                catch (Exception e)
                {
                    await transaccion.RollbackAsync();
                    return new mensajeJson(e.Message, null);
                }
            }
        }

        public async Task<GuiaSalidaModel> datosinicioAsync()
        {
            try
            {
                GuiaSalidaModel model = new GuiaSalidaModel();
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                model.empresa = await db.EMPRESA.ToListAsync();//Where(x => x.idempresa == idempresa)
                model.clase = await db.ACLASE.Where(x => x.estado != "ELIMINADO").ToListAsync();
                model.subclase = await db.ASUBCLASE.Where(x => x.estado != "ELIMINADO" || x.estado != "DESHABILITADO").ToListAsync();
                var sucursales = await (from s in db.SUCURSAL
                                        join ASU in db.AALMACENSUCURSAL
                                        on s.suc_codigo equals ASU.suc_codigo
                                        where s.estado != "DESHABILITADO" && s.estado != "ELIMINADO"
                                        //&& s.idempresa == idempresa
                                        orderby s.descripcion
                                        select new SUCURSAL
                                        {
                                            descripcion = s.descripcion,
                                            suc_codigo = s.suc_codigo,
                                            idempresa = s.idempresa
                                        }).Distinct().ToListAsync();
                model.sucursal = sucursales;
                return model;
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                if (id is 0 || id is null)
                    return (new mensajeJson("nuevo", null));
                var obj = await db.AGUIASALIDA.FirstOrDefaultAsync(m => m.idguiasalida == id);
                if (obj is null)
                    return (new mensajeJson("notfound", null));
                else if (obj.estado == "ELIMINADO")
                    return (new mensajeJson("notfound", null));
                else
                {
                    if (obj.idempresa == idempresa && obj.idsucursal == idsucursal)
                    {
                        if (obj.idempleadoaudita is null)
                            obj.empleado = new EMPLEADO { userName = user.getUserNameAndLast() };
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        var empresa = await db.EMPRESA.FindAsync(obj.idempresa);
                        var sucursal = await db.SUCURSAL.FindAsync(obj.idsucursal);
                        return (new mensajeJson("Este registro pertenece a la empresa " + empresa.descripcion + ", Sucursal " + sucursal.descripcion, null));
                    }
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<AGuiaSalida> BuscarGuiaSalidaAsync(int? id, int idempresa)
        {
            var obj = await db.AGUIASALIDA.Where(x => x.idguiasalida == id && x.idempresa == idempresa).FirstOrDefaultAsync();
            if (obj is null)
                obj = new AGuiaSalida { idguiasalida = 0 };
            return obj;
        }
        private async Task<string> generarcodigoAsync(int idempresa)
        {

            string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AGUIASALIDA.Where(x => x.idempresa == idempresa && x.ano == ano).Count();

            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
    }
}
