using ENTIDADES.preingreso;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.PreIngreso.ViewModel;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface IAnalisisOrganolepticoEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(PIAnalisisOrganoleptico analisisorganoleptico);
        public  Task<mensajeJson> BuscarAsync(int? id);
        public Task<AnalisisOrganolepticoModel> datosinicioViewBagAsync();
    }
}
