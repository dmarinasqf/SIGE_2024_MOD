using ENTIDADES.preingreso;
using Erp.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface ICaracteristicaAOEF

    {
        public Task<mensajeJson> RegistrarEditarAsync(PICaracteristicaAO obj);
        public Task<mensajeJson> DeshabilitarAsync(int? id);
        public Task<mensajeJson> HabilitarAsync(int? id);
        //public  Task<mensajeJson> ListarHabilitadoAsync();
        public Task<List<PICaracteristicaAO>> ListarAsync(string estado, string idcategoria);
        public Task<mensajeJson> BuscarAsync(int id);


    }
}
