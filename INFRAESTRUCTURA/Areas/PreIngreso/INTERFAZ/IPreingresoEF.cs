using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.PreIngreso.ViewModel;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES.Almacen;
using Erp.Persistencia.Modelos;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
   public interface IPreingresoEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(PIPreingreso preingreso, List<AAlmacenSucursal> lAlmacenSucursal, int idempleado, string rutadoc);
        public  List<PIFacturaPreingreso> ListarFacturas(int id);
             
        public  Task<string> RemoverCabeceraAsync(int id);
        public  Task<mensajeJson> AnularPreingresoAsync(int id, int idfactura, string jsonstock);
        public  Task<string> ActualizarOrdenCompraAplicadaAsync(int[] ordenes);
        public  Task<mensajeJson> ActualizarLotesAsync(PILote[] lotes);
        public  Task<mensajeJson> EliminarItemLoteAsync(int id, int iddetalle);
        public  Task<mensajeJson> BuscarLotesItemDetallePreingresoAsync(int id);
        public mensajeJson VerificarIngresoOrdenAlmacenes(int orden, int sucursal);
        public  Task<PreingresoModel> datosinicioAsync();
        public mensajeJson VerificarSiOrdenTienePreingreso(int idorden);
        public string sucursaldeloginesdelaempresa();

        public mensajeJson eliminarchivodriveapi(string codcarpeta, string coddocumento);
        public mensajeJson editararchivoapi(string codcarpeta, string coddocumento,string rutadoc);
    }
}
