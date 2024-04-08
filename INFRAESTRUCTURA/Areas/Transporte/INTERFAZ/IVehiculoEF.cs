using ENTIDADES.Transporte;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Transporte.EF
{
    public interface IVehiculoEF
    {
        public Task<mensajeJson> ListarVehiculoxEmpresaAsync(int? idempresa);
        public Task<mensajeJson> RegistrarEditarAsync(TVehiculo obj);
        public Task<mensajeJson> BuscarVehiculoxIdAsync(int? id);
        public Task<mensajeJson> DeshabilitarAsync(int? id);

        public Task<mensajeJson> HabilitarAsync(int? id);
        
    }
}
