using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IIngresoTransferenciaEF
    {
        public  Task<mensajeJson> ListarGuiasEntradaAsync();  
        public  Task<mensajeJson> RegistrarEditarAsync(AIngresoTransferencia obj);
        public  Task<IngresoTransferenciaModel> datosinicioViewBagAsync();
        public  Task<mensajeJson> BuscarAsync(int? id);
    }
}
