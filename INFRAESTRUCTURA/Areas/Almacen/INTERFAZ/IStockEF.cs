using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
  public  interface IStockEF
    {
        public object BuscarStock_Producto(long idstock);
        public object BuscarStock_ProductoxLaboratorio(int idlaboratorio,int idsucursal);
        public mensajeJson ActualizarStock(AStockLoteProducto stock,string userid);
    }
}
