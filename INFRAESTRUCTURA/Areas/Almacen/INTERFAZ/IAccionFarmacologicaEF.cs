using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IAccionFarmacologicaEF
    {
        public Task<List<AAccionFarmacologica>> ListarAsync();
        public Task<mensajeJson> RegistrarEditarAsync(AAccionFarmacologica obj);
        public Task<mensajeJson> EliminarAsync(int? id);
        public Task<mensajeJson> HabilitarAsync(int? id);
        public Task<List<AAccionFarmacologica>> ListarAccionesFarmaHabilitadasAsync();
      
    }
}
