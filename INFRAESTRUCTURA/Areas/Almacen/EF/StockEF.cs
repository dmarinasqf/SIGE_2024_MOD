using Erp.Persistencia.Modelos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.SeedWork;
using ENTIDADES.Almacen;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class StockEF:IStockEF
    {
        private readonly Modelo db;
        //editado por mi
        public StockEF(Modelo context)
        {
            db = context;
        }
        public object BuscarStock_Producto(long idstock)
        {
            var query = (from s in db.ASTOCKPRODUCTOLOTE
                         join p in db.APRODUCTO on s.idproducto equals p.idproducto
                         join asl in db.AALMACENSUCURSAL on s.idalmacensucursal equals asl.idalmacensucursal
                         join ar in db.AAREAALMACEN on asl.idareaalmacen equals ar.idareaalmacen
                         join a in db.AALMACEN on asl.idalmacen equals a.idalmacen
                         where s.idstock==idstock
                       select new
                       {
                           s.idstock,
                           p.idproducto,
                           p.codigoproducto,
                           p.nombre,
                           p.nombreabreviado,
                           s.multiplo,
                           s.multiploblister,
                           p.aceptafechavence,
                           p.aceptalote,
                           p.aceptaregsanitario,
                           p.venderblister,
                           s.candisponible,
                           lote=s.lote??"",
                           regsanitario = s.regsanitario??"",
                           fechavencimiento = s.fechavencimiento==null?"": s.fechavencimiento.Value.ToString("yyyy-MM-dd"),
                           fechaingreso = s.fechacreacion==null?"": s.fechacreacion.Value.ToString("yyyy-MM-dd"),
                           s.idalmacensucursal,
                           stockracionado = (s.multiplo == 0 || s.multiplo == 1 ) ?  s.candisponible  : Convert.ToInt32(s.candisponible/s.multiplo),
                           maxcaja = Convert.ToInt32(s.candisponible / (s.multiplo == 0  ? 1 : (s.multiplo == null ? 1 : s.multiplo))),
                           areaalmacen =$"{ar.descripcion}-{a.descripcion}"

                       }).FirstOrDefault();
            return query;
        }
        public object BuscarStock_ProductoxLaboratorio(int idlaboratorio,int idsucursal)
        {
            var query = (from s in db.ASTOCKPRODUCTOLOTE
                         join p in db.APRODUCTO on s.idproducto equals p.idproducto
                         join asl in db.AALMACENSUCURSAL on s.idalmacensucursal equals asl.idalmacensucursal
                         join ar in db.AAREAALMACEN on asl.idareaalmacen equals ar.idareaalmacen
                         join a in db.AALMACEN on asl.idalmacen equals a.idalmacen
                         where p.idlaboratorio == idlaboratorio && asl.suc_codigo==idsucursal && s.candisponible>0
                         select new
                         {
                             s.idstock,
                             p.idproducto,
                             p.codigoproducto,
                             p.nombre,
                             p.nombreabreviado,
                             s.multiplo,
                             s.multiploblister,
                             p.aceptafechavence,
                             p.aceptalote,
                             p.aceptaregsanitario,
                             p.venderblister,
                             s.candisponible,
                             lote = s.lote ?? "",
                             regsanitario = s.regsanitario ?? "",
                             fechavencimiento = s.fechavencimiento == null ? "" : s.fechavencimiento.Value.ToString("yyyy-MM-dd"),
                             fechaingreso = s.fechacreacion == null ? "" : s.fechacreacion.Value.ToString("yyyy-MM-dd"),
                             s.idalmacensucursal,

                             areaalmacen = $"{ar.descripcion}-{a.descripcion}"

                         }).ToList();
            return query;
        }
        public mensajeJson ActualizarStock(AStockLoteProducto stock,string modifica)
        {
            int cantdisponible = 0;
            try
            {
                var objaux = db.ASTOCKPRODUCTOLOTE.Find(stock.idstock);
                cantdisponible = objaux.candisponible.Value;
                if (objaux is null)
                    return new mensajeJson("No existe el registro que esta editando", null);
                objaux.multiplo = stock.multiplo;
                objaux.multiploblister = stock.multiploblister;
                objaux.candisponible = stock.candisponible;
                objaux.edicion = null;
                objaux.usuariomodifica = modifica;

                if (cantdisponible - stock.candisponible > 0)
                    objaux.edicion = objaux.setedicion("SALIDA", "AjusteManual", "", (cantdisponible - stock.candisponible).ToString());
                else
                    objaux.edicion = objaux.setedicion("INGRESO", "AjusteManual", "", (-1*(cantdisponible - stock.candisponible)).ToString());

                db.Update(objaux);
                db.SaveChanges();
                return new mensajeJson("ok", objaux);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
          
        }
    }
}
