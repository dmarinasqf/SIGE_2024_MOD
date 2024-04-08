using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
   public interface ISalidaTransferencia
    {
        //public Task<mensajeJson> RegistrarAsync(ASalidaTransferencia salida);
        //public Task<mensajeJson> AnularAsync(long? id);
        public Task<mensajeJson> ListarAsync(string id,string codigo,string idsucursalorigen,string idsucursaldestino,string fecha);
        public Task<mensajeJson> BuscarAsync(int? id);
        public Task<SalidaTransferenciaModel> datosinicioAsync();
    }
}
