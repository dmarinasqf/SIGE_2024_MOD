using ENTIDADES.preingreso;
using Erp.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface IRangoMuestraAOEF
    {
        public Task<mensajeJson> RegistrarEditarAsync(PIRangoMuestraAO obj);
        public  Task<mensajeJson> EliminarAsync(int? id);             
        public  Task<mensajeJson> ListarHabilitadoAsync();
        public Task<List<PIRangoMuestraAO>> ListarAsync();
        public Task<mensajeJson> BuscarAsync(int id);
        
    }
}
