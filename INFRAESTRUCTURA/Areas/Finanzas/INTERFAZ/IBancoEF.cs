using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using Erp.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ
{
    public interface IBancoEF
    {
        public Task<List<FBanco>> ListarAsync();
        public Task<mensajeJson> RegistrarEditarAsync(FBanco obj);
        public Task<mensajeJson> EliminarAsync(int? id);
        public Task<List<FTipoTarjeta>> ListarTipoTarjetaAsync();
        public Task<object> ListarCuentasHabilitadosAsync(int idbanco);
        public Task<object> ListarBancosHabilitadosAsync();
    }
}