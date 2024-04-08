using ENTIDADES.Almacen;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class InventarioEF : IInventarioEF
    {
        private readonly Modelo db;
        public InventarioEF(Modelo context)
        {
            db = context;
        }

        public async Task<mensajeJson> RegistrarInicioInventarioAsync(AInventario oInventario)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var lStockLoteProducto = db.ASTOCKPRODUCTOLOTE.Where(x => x.idalmacensucursal == oInventario.idalmacensucursal && x.candisponible >= 0 && x.estado == "HABILITADO").ToList();
                    oInventario.fechainicio = DateTime.Now;
                    oInventario.fechafin = Convert.ToDateTime("1900/01/01");
                    oInventario.estado = "HABILITADO";
                    await db.AINVENTARIO.AddAsync(oInventario);
                    await db.SaveChangesAsync();

                    List<AStockLoteProducto> lStockLoteProductoLaboratorio = new();
                    foreach (var item in lStockLoteProducto)
                    {
                        var oProducto = db.APRODUCTO.Where(x => x.idproducto == item.idproducto).FirstOrDefault();
                        if (oProducto.idlaboratorio is null) oProducto.idlaboratorio = 0;
                        if (oProducto.idlaboratorio == oInventario.idlaboratorio)
                        {
                            item.estado = "CONGELADO";
                            item.edicion = item.setedicion("SALIDA", "Inventario", oInventario.idinventario.ToString(), "0");
                            item.candisponible = 0;
                            item.caningreso = 0;
                            lStockLoteProductoLaboratorio.Add(item);
                        }
                    }
                    if (lStockLoteProductoLaboratorio.Count == 0)
                    {
                        transaccion.Rollback();
                        return new mensajeJson("No se encontró productos pertenecientes a ese Laboratorio, Almacen y Sucursal.", null);
                    }
                    db.ASTOCKPRODUCTOLOTE.UpdateRange(lStockLoteProductoLaboratorio);
                    await db.SaveChangesAsync();

                    transaccion.Commit();
                    return new mensajeJson("ok", oInventario);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        public async Task<mensajeJson> RegistrarDetalleInventarioAsync(AInventarioDetalle oInventarioDetalle)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    oInventarioDetalle.estado = "HABILITADO";
                    await db.AINVENTARIODETALLE.AddAsync(oInventarioDetalle);
                    await db.SaveChangesAsync();

                    transaccion.Commit();
                    return new mensajeJson("ok", oInventarioDetalle);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        public async Task<mensajeJson> RegistrarFinalizacionInventarioAsync(AInventario oInventario)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var oInventarioDB = db.AINVENTARIO.Where(x => x.idinventario == oInventario.idinventario).FirstOrDefault();
                    oInventarioDB.estado = "FINALIZADO";
                    oInventarioDB.fechafin = DateTime.Now;
                    oInventarioDB.usuariofinaliza = oInventarioDB.usuarioinicia;
                    db.AINVENTARIO.Update(oInventarioDB);
                    await db.SaveChangesAsync();

                    if (oInventario.jsondetalle != "")
                    {
                        var lInventarioDetalle = JsonConvert.DeserializeObject<List<AInventarioDetalle>>(oInventario.jsondetalle);
                        db.AINVENTARIODETALLE.AddRange(lInventarioDetalle);
                        await db.SaveChangesAsync();
                    }

                    var lStockLoteProducto = db.ASTOCKPRODUCTOLOTE.Where(x => x.idalmacensucursal == oInventarioDB.idalmacensucursal && x.estado == "CONGELADO").ToList();
                    foreach (var item in lStockLoteProducto)
                    {
                        item.estado = "HABILITADO";
                    }
                    db.ASTOCKPRODUCTOLOTE.UpdateRange(lStockLoteProducto);
                    await db.SaveChangesAsync();

                    transaccion.Commit();
                    return new mensajeJson("ok", oInventarioDB);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        public async Task<mensajeJson> RegistrarLoteAsync(AStockLoteProducto oStockLoteProducto)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var oProducto = db.APRODUCTO.Where(x => x.idproducto == oStockLoteProducto.idproducto).FirstOrDefault();
                    oStockLoteProducto.estado = "CONGELADO";
                    oStockLoteProducto.candisponible = 0;
                    oStockLoteProducto.caningreso = 0;
                    oStockLoteProducto.multiplo = oProducto.multiplo ?? 1;
                    oStockLoteProducto.multiploblister = oProducto.multiploblister ?? 1;
                    oStockLoteProducto.tabla = "Almacen.Inventario";
                    await db.AddAsync(oStockLoteProducto);
                    await db.SaveChangesAsync();

                    transaccion.Commit();
                    return new mensajeJson("ok", oStockLoteProducto);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
    }
}
