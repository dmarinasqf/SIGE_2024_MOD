using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IMantenimientoGuiaEF
    {
        public  Task<List<AGuiaSalida>> ListarAsync();  
        public  Task<mensajeJson> MantenimientoGuiaRegistrarEditarAsync(AGuiaSalida obj,string jsondetalleeliminar);
        public  Task<mensajeJson> AnularAsync(long? id);
        public  Task<mensajeJson> AnularDuplicarAsync(AGuiaSalida obj);
        public  Task<mensajeJson> HabilitarAsync(int? id);
        public Task<GuiaSalidaModel> datosinicioAsync();
        //public Task<AGuiaSalida> BuscarGuiaSalidaAsync(int? id, int idempresa);
        public Task<mensajeJson> BuscarAsync(int? id);
    }
    
}
