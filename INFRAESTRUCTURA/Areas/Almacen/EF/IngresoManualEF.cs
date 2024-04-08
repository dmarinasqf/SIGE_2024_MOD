using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class IngresoManualEF : IIngresoManualEF
    {
        private readonly Modelo db;

        public IngresoManualEF(Modelo context)
        {
            db = context;
        }

        public async System.Threading.Tasks.Task<mensajeJson> RegistrarAsync(AIngresoManual ingreso)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var detalle = JsonConvert.DeserializeObject<List<ADetalleIngresoManual>>(ingreso.jsondetalle);

                    if (ingreso.idingreso is 0)
                    {
                        ingreso.estado = "HABILITADO";
                        ingreso.fecha = DateTime.Now;
                        db.Add(ingreso);
                        await db.SaveChangesAsync();

                        for (int i = 0; i < detalle.Count; i++)
                        {
                            detalle[i].idingreso = ingreso.idingreso;
                            detalle[i].estado = "HABILITADO";
                        }
                        db.AddRange(detalle);
                        await db.SaveChangesAsync();

                        //registrar stock nuevo
                        //var listanueva = new List<AStockLoteProducto>();
                        //var listaedicion = new List<AStockLoteProducto>();

                        //for (int i = 0; i < detalle.Count; i++)
                        //{
                        //    var producto = db.APRODUCTO.Find(detalle[i].idproducto);
                        //    if (producto.multiplo is null || producto.multiplo is 0) producto.multiplo = 1;
                        //    if (producto.multiploblister is null || producto.multiploblister is 0) producto.multiploblister = 1;
                        //    if (detalle[i].idstock is null || detalle[i].idstock is 0)//guardar productos nuevos
                        //    {
                        //        var stock = new AStockLoteProducto();
                        //        if (detalle[i].isfraccion.HasValue && detalle[i].isfraccion.Value)
                        //        {
                        //            stock.candisponible = detalle[i].cantidad.Value;
                        //            stock.caningreso = detalle[i].cantidad.Value;
                        //        }
                        //        else if (detalle[i].isblister.HasValue && detalle[i].isblister.Value)
                        //        {
                        //            stock.candisponible = (producto.multiplo / producto.multiploblister) * detalle[i].cantidad.Value;
                        //            stock.caningreso = (producto.multiplo / producto.multiploblister) * detalle[i].cantidad.Value;
                        //        }
                        //        else
                        //        {
                        //            stock.candisponible = detalle[i].cantidad.Value * producto.multiplo;
                        //            stock.caningreso = detalle[i].cantidad.Value * producto.multiplo;
                        //        }
                        //        stock.estado = "HABILITADO";
                        //        stock.fechavencimiento = detalle[i].fechavencimiento;
                        //        stock.lote = detalle[i].lote;
                        //        stock.regsanitario = detalle[i].regsanitario;
                        //        stock.multiplo = producto.multiplo;
                        //        stock.multiploblister = producto.multiploblister;
                        //        stock.idalmacensucursal = detalle[i].idalmacensucursal;
                        //        stock.idtabla = detalle[i].iddetalle.ToString();
                        //        stock.tabla = "DetalleIngresoManual";
                        //        stock.idproducto = detalle[i].idproducto;
                        //        listanueva.Add(stock);
                        //    }
                        //    else// editar stock productos existente
                        //    {
                        //        var stock = new AStockLoteProducto();
                        //        var verificar_stock = listaedicion.Where(x => x.idstock == detalle[i].idstock).FirstOrDefault();
                        //        if (verificar_stock is null)
                        //            stock = db.ASTOCKPRODUCTOLOTE.Find(detalle[i].idstock);
                        //        else
                        //            stock = verificar_stock;
                        //        stock._idtablaedicion = detalle[i].iddetalle.ToString();
                        //        if (detalle[i].isfraccion.HasValue && detalle[i].isfraccion.Value)
                        //        {
                        //            stock.candisponible += detalle[i].cantidad.Value;
                        //            stock.caningreso += detalle[i].cantidad.Value;
                        //            stock._cantidadedita = detalle[i].cantidad.Value;
                        //        }
                        //        else if (detalle[i].isblister.HasValue && detalle[i].isblister.Value)
                        //        {
                        //            stock.candisponible += (producto.multiplo / producto.multiploblister) * detalle[i].cantidad.Value;
                        //            stock.caningreso += (producto.multiplo / producto.multiploblister) * detalle[i].cantidad.Value;
                        //            stock._cantidadedita = (producto.multiplo.Value / producto.multiploblister.Value) * detalle[i].cantidad.Value;
                        //        }
                        //        else
                        //        {
                        //            stock.candisponible += detalle[i].cantidad.Value * producto.multiplo;
                        //            stock.caningreso += detalle[i].cantidad.Value * producto.multiplo;
                        //            stock._cantidadedita = detalle[i].cantidad.Value * producto.multiplo.Value;
                        //        }

                        //        listaedicion.Add(stock);
                        //    }
                        //}
                        ////actualizar stock
                        //if (listaedicion.Count > 0)
                        //{
                        //    for (int i = 0; i < listaedicion.Count; i++)
                        //    {
                        //        listaedicion[i].edicion = listaedicion[i].setedicion("INGRESO", "DetalleIngresoManual", listaedicion[i]._idtablaedicion, listaedicion[i]._cantidadedita.ToString());

                        //    }
                        //    db.ASTOCKPRODUCTOLOTE.UpdateRange(listaedicion);
                        //    await db.SaveChangesAsync();
                        //}
                        ////registrar nuevo stock
                        //if (listanueva.Count > 0)
                        //{
                        //    db.ASTOCKPRODUCTOLOTE.AddRange(listanueva);
                        //    await db.SaveChangesAsync();

                        //}                        
                        transaccion.Commit();
                        return new mensajeJson("ok", ingreso);
                    }
                    else
                    {
                        transaccion.Rollback();
                        return new mensajeJson("El ingreso ya ha sido registrado", null);

                    }
                }
                catch (Exception e)
                {

                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException!=null)
                         error = e.InnerException.Message;
                    return new mensajeJson(e.Message+" "+error, null);
                }
            }
        }
        public async System.Threading.Tasks.Task<mensajeJson> RegistrarSalidaAsync(ASalidaManual salida)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var detalle = JsonConvert.DeserializeObject<List<ADetalleSalidaManual>>(salida.jsondetalle);

                    if (salida.idsalida is 0)
                    {
                        salida.estado = "HABILITADO";
                        salida.fecha = DateTime.Now;
                        db.Add(salida);
                        await db.SaveChangesAsync();

                        for (int i = 0; i < detalle.Count; i++)
                        {
                            detalle[i].idsalida = salida.idsalida;
                            detalle[i].estado = "HABILITADO";
                        }
                        db.AddRange(detalle);
                        await db.SaveChangesAsync();
                      
                        var listaedicion = new List<AStockLoteProducto>();
                   
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            var stock = new AStockLoteProducto();
                            var verificar_stock = listaedicion.Where(x => x.idstock == detalle[i].idstock).FirstOrDefault();
                            if (verificar_stock is null)
                                stock = db.ASTOCKPRODUCTOLOTE.Find(detalle[i].idstock);
                            else
                                stock = verificar_stock;
                            var cantdisminuir = 0;
                            if (stock.multiplo is null || stock.multiplo is 0) stock.multiplo = 1;
                            if (stock.multiploblister is null || stock.multiploblister is 0) stock.multiploblister = 1;                                                        
                                if (detalle[i].isfraccion.HasValue && detalle[i].isfraccion.Value)
                                cantdisminuir = detalle[i].cantidad.Value;                                    
                                else if (detalle[i].isblister.HasValue && detalle[i].isblister.Value)
                                cantdisminuir = (stock.multiplo.Value / stock.multiploblister.Value) * detalle[i].cantidad.Value;
                                else
                                cantdisminuir = detalle[i].cantidad.Value * stock.multiplo.Value;
                            stock.candisponible -= cantdisminuir;
                            stock._cantidadedita = cantdisminuir;
                            stock._idtablaedicion = detalle[i].iddetalle.ToString();
                            if (stock.candisponible <= 0)
                                stock.candisponible = 0;

                            listaedicion.Add(stock);
                         
                        }
                        //actualizar stock
                        if (listaedicion.Count > 0)
                        {
                            for (int i = 0; i < listaedicion.Count; i++)
                            {
                                listaedicion[i].edicion = listaedicion[i].setedicion("SALIDA", "SalidaManualDetalle", listaedicion[i]._idtablaedicion, listaedicion[i]._cantidadedita.ToString());
                               
                            }
                            db.ASTOCKPRODUCTOLOTE.UpdateRange(listaedicion);
                             db.SaveChanges();
                        }                       
                        transaccion.Commit();
                        
                        return new mensajeJson("ok", salida);
                    }
                    else
                    {
                        transaccion.Rollback();
                        return new mensajeJson("El salida ya ha sido registrada", null);

                    }
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
