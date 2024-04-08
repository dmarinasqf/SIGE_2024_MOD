using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;

using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
   public interface IEquivalenciaEF
    {

        public  Task<EquivalenciaModel> ListarModelAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AEquivalencia obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
