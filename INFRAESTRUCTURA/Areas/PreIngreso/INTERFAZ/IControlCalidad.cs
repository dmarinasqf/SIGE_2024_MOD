using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.PreIngreso.ViewModel;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface IControlCalidad
    {
        public  Task<mensajeJson> RegistrarEditarAsync(PIControlCalidad control);       
        public  Task<mensajeJson> ListarControlCalidad(string codigo,string estado,string fecha, string top);       
        public  Task<mensajeJson> ListarControlCalidadCompleto(int id);       
        public  Task<mensajeJson> ListarControlCalidadImpresion(int id);       
        public  Task<PreingresoModel> datosinicioAsync();
       
    }
}
