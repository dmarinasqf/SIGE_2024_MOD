using ENTIDADES.Finanzas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ
{
    public interface  IMonedaEF
    {
        public Task<List<FMoneda>> ListarAsync();
        public Task<List<FMoneda>> ListarHabilitadosAsync();
        public Task<mensajeJson> RegistrarEditarAsync(FMoneda obj);
        public Task<mensajeJson> EliminarAsync(int? id);
    }
}
