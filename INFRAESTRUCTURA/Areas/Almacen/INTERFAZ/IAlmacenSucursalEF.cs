using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
  public  interface IAlmacenSucursalEF
    {
        public  Task<AlmacenSucursalModel> ListarModelAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AAlmacenSucursal obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);
        public  object BuscarAlmacenxSucursal2(int idsucursal);
    }
}
