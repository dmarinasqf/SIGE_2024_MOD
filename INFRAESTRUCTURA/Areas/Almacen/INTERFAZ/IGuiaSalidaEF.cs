using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES.ventas;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IGuiaSalidaEF
    {
        public Task<List<AGuiaSalida>> ListarAsync();
        public Task<mensajeJson> AuditoriaGuiaRegistrarEditarAsync(AGuiaSalida obj, string detalle);
        public Task<mensajeJson> GenerarListaGuiaSalida(string listaguiasalidajson, string idsucursal);
        public Task<mensajeJson> RegistrarGuiaCliente(string listaguiasalidajson, string idsucursal);
        public Task<mensajeJson> RegistrarGuiaSalidaDesdeVentas(Venta venta);
        public Task<GuiaSalidaModel> datosinicioAsync();
        public Task<AGuiaSalida> BuscarGuiaSalidaAsync(int? id, int idempresa);
        public Task<mensajeJson> BuscarAsync(int? id);
    }   
}
