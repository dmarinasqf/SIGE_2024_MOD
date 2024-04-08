using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IInventarioEF
    {
        public Task<mensajeJson> RegistrarInicioInventarioAsync(AInventario oInventario);
        public Task<mensajeJson> RegistrarDetalleInventarioAsync(AInventarioDetalle oInventario);
        public Task<mensajeJson> RegistrarFinalizacionInventarioAsync(AInventario oInventario);
        public Task<mensajeJson> RegistrarLoteAsync(AStockLoteProducto oStockLoteProducto);
    }
}
