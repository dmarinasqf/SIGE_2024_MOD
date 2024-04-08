using ENTIDADES.Transporte;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Transporte.EF
{
    public interface IEmpresaTransporteEF
    {
        public Task<List<TEmpresa>> ListarAsync();
        public Task<List<TEmpresa>> ListarHabilitadosAsync();
        public Task<mensajeJson> RegistrarEditarAsync(TEmpresa obj);
        public Task<mensajeJson> DeshabilitarAsync(int? id);

        public Task<mensajeJson> HabilitarAsync(int? id);
        
    }
}
