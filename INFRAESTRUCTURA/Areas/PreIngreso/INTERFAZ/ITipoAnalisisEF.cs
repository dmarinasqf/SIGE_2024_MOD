using ENTIDADES.preingreso;
using Erp.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface ITipoAnalisisEF
    {
        public Task<mensajeJson> RegistrarEditarAsync(PITipoAnalisis obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);        
        public  Task<mensajeJson> ListarTiposAnalisisHabilitadoAsync();
        public  Task<mensajeJson> ListarTipoAnalisisAsync();
        public Task<mensajeJson> BuscarTipoAnalisisAsync(int id);
        public Task<List<PITipoAnalisis>> ListarAsync();
    }
}
