using ENTIDADES.preingreso;
using Erp.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface ICategoriaAOEF

    {
        public Task<mensajeJson> RegistrarEditarAsync(PICategoriaAO obj);
        public Task<mensajeJson> DeshabilitarAsync(int? id);             
        public Task<mensajeJson> HabilitarAsync(int? id);             
        public  Task<mensajeJson> ListarHabilitadoAsync();
        public Task<List<PICategoriaAO>> ListarAsync();
        public Task<mensajeJson> BuscarAsync(int id);
        
    }
}
