using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
   public  interface IProductoEF
    {
        public  Task<ProductoModel> ListarModelAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AProducto objproducto);
        public  Task<mensajeJson> ActivarProductoAsync(int? id);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public AProducto buscarProducto(int? id);
        public  Task<List<CProveedor>> listarproveedoresAsync();
        public  Task<List<AProducto>> listarProductosporcategoriaAsync(string categoria);
        public  Task<List<ATipoProducto>> ListarTipoProductoAsync();
        public  Task<List<ADetalleAccionFarmacologica>> getDetalleAccionFarmaxProducto(int? id);
        public  Task<object> getDetallePrincipioActivoxProducto(int? id);
        public Task<mensajeJson> BuscarAsync(int? id);
        public List<AProducto> ListarProductosxLaboratorio(int idlaboratorio);
    }
}
