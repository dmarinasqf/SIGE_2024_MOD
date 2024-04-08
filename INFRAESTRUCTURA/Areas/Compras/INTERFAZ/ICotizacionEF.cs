using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES.Almacen;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
   public interface ICotizacionEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(CCotizacion cotizacion);      
        public  Task<CCotizacion> BuscarAsync(int id);  
        public  Task<CCotizacion> DuplicarAsync(int id);
        public  Task<mensajeJson> AnularCotizacionAsync(int? id);
        public  Task<mensajeJson> habilitarCotizacionAsync(int? id);
        public string EliminarItemDetalle(int id);
        public List<CBonificacionCotizacion> getBonificacion(int id);
        public  Task<mensajeJson> guardarBonificacionAsync(CBonificacionCotizacion[] array, int iddetalle);
        public  Task<string> UsarProformaAsync(int[] proformas);
        public  Task<mensajeJson> BuscarProveedorCotizacionAsync(int idproforma);
        public  mensajeJson BuscarDatosProveedor(int idproveedor);
        public  Task<mensajeJson> BuscarPrimeraCotizacionAsync(int idproforma);
        public  Task<CotizacionModel> datosiniciocotizacionAsync();
        //public mensajeJson BuscarUltimaCompraxProducto(int idproducto, int iddetallecotizacion);
        //FSILVA 19/12/2012
        public Task<AUnidadMedida> CargarUnidadMedida(int? id);
    }

}
