using ENTIDADES.Almacen;
using ENTIDADES.ventas;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
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

namespace INFRAESTRUCTURA.Areas.Ventas.EF
{
  public  class NotacdEF: INotacdEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly IVentaEF ventaef;

        public NotacdEF(Modelo _db, IVentaEF _ventaef, IUser user_)
        {
            db = _db;
            user = user_;
            ventaef = _ventaef;

        }

        public async Task<mensajeJson> RegistrarVentaDirectaAsync(NotaCD nota,int idCajasucursalpara)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var venta = db.VENTA.Find(nota.idventa);
                    if(venta.estado!="HABILITADO")
                        return new mensajeJson($"El documento esta {venta.estado}", null);
                   

                    //obtener correlativo de documento
                    var aperturacaja = db.APERTURACAJA.Find(nota.idaperturacaja);
                    if (aperturacaja.estado != "APERTURADA")
                        return new mensajeJson("La caja ha sido cerrada.", null);

                    int idCajasucursall = (idCajasucursalpara != 0) ? idCajasucursalpara : aperturacaja.idcajasucursal;

                    var cajacorrelativo = db.CAJASUCURSAL.Find(idCajasucursall);
                    //verificar si esta asociado a otra caja
                    if (cajacorrelativo.correlativoasociadoaotracaja.HasValue && cajacorrelativo.correlativoasociadoaotracaja.Value)
                        cajacorrelativo = db.CAJASUCURSAL.Find(cajacorrelativo.idcajacorrelativoasociado);

                    var correlativo = db.CORRELATIVODOCUMENTO.Where(x => x.iddocumento == nota.iddocumento && x.idcajasucursal == cajacorrelativo.idcajasucursal).FirstOrDefault();
                    if (correlativo is null)
                        return new mensajeJson("La caja no tiene asignado correlativos para el documento seleccionado", null);

                    var correlativoactual = correlativo.actual + 1;
                    AgregarCeros ceros = new AgregarCeros();
                    nota.numdocumento = ceros.agregarCeros(correlativoactual.Value);
                    nota.serie = correlativo.serie;
                    nota.fecha = DateTime.Now;
                    nota.estado = "HABILITADO";                  
                    //guardar cabecera

                    db.NOTACREDITODEBITO.Add(nota);
                    await db.SaveChangesAsync();
                  
                    var detalle = JsonConvert.DeserializeObject<List<DetalleNotaCD>>(nota.jsondetalle);
                    //guardar detalle
                    for (int i = 0; i < detalle.Count; i++)
                        detalle[i].idnota = nota.idnota;
                    db.AddRange(detalle);
                    await db.SaveChangesAsync();                    
                    var devolverstock = devolverstockdeventa(nota.idnota);
                    if (devolverstock!="ok")
                    {
                        transaccion.Rollback();
                        return new mensajeJson(devolverstock, null);
                    }

                    //actualizar correlativo
                    correlativo.actual += 1;
                    correlativo.iseditable = false;
                    db.Update(correlativo);
                    await db.SaveChangesAsync();

                    transaccion.Commit();

                    return new mensajeJson("ok", nota);

                }
                catch (Exception e)
                {

                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }

        }

        public async Task<mensajeJson> VerificarSiVentaTieneNotaAsync(long idventa)
        {

            try {
                var notas = await db.NOTACREDITODEBITO.Where(x => x.estado == "HABILITADO" && x.idventa == idventa).ToListAsync();
                var venta = await db.VENTA.FindAsync(idventa);
                if (notas.Count == 0)
                    return new mensajeJson("ok", "");

                return new mensajeJson("ok", $"Al documento  {venta.serie}-{venta.numdocumento} ya le fue aplicado " + notas.Count + " NC");
            }
            catch (Exception e)
            {
                // Retornar un mensaje de error en español
                return new mensajeJson("error", $"Error al verificar la venta con ID {idventa}: {e.Message}");
            }
          
       

        }
        public string devolverstockdeventa(long idnota)
        {
            try
            {
                var cabecera = db.NOTACREDITODEBITO.Where(x => x.idnota == idnota).ToList();
                int idtiponota = cabecera[0].idtipodocumento;
                if (idtiponota != 21 && idtiponota != 22) {
                    var detalle = db.DETALLENOTACREDITODEBITO.Where(x => x.idnota == idnota && x.estado == "HABILITADO").ToList();
                    var listaedicion = new List<AStockLoteProducto>();
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        var stock = new AStockLoteProducto();
                        var aux_ = listaedicion.Where(x => x.idstock == detalle[i].idstock.Value).FirstOrDefault();
                        if (aux_ is null)
                            stock = db.ASTOCKPRODUCTOLOTE.Find(detalle[i].idstock);
                        else
                            stock = aux_;
                        stock.multiplo = stock.multiplo ?? 1;
                        stock.multiploblister = stock.multiploblister ?? 1;
                        var cantidaddisminuir = 0;
                        if (stock.multiplo is 0) stock.multiplo = 1;
                        if (stock.multiploblister is 0) stock.multiploblister = 1;
                        if (detalle[i].isfraccion.HasValue && detalle[i].isfraccion.Value)
                        {
                            stock.candisponible += detalle[i].cantidad;
                            cantidaddisminuir = detalle[i].cantidad;
                        }
                        else if (detalle[i].isblister.HasValue && detalle[i].isblister.Value)
                        {
                            stock.candisponible += (stock.multiplo ?? 1 / stock.multiploblister ?? 1) * detalle[i].cantidad;
                            cantidaddisminuir = (stock.multiplo ?? 1 / stock.multiploblister ?? 1) * detalle[i].cantidad;
                        }
                        else
                        {
                            stock.candisponible += detalle[i].cantidad * stock.multiplo ?? 1;
                            cantidaddisminuir = detalle[i].cantidad * stock.multiplo ?? 1;
                        }

                        stock.edicion = stock.setedicion("INGRESO", "DetalleNotaCD", detalle[i].iddetalle.ToString(), cantidaddisminuir.ToString());
                        listaedicion.Add(stock);


                    }
                    db.UpdateRange(listaedicion);
                    db.SaveChanges();
                }
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }

        }
    }
   
}
