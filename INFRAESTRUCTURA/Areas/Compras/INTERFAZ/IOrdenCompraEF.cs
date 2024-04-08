using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
   public  interface IOrdenCompraEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(COrdenCompra orden);     
        public  Task<mensajeJson> EditarDetalleAsync(int[] detalle);
        public  Task<mensajeJson> RegistrarItemPorDiferenciaCantidad(string jsondetalle);
        public  Task<mensajeJson> AnularOrdenAsync(int id);
        public  Task<mensajeJson> AprobarOCAsync(COrdenCompra obj);
        public Task<OrdenCompraModel> datosiniciocotizacionAsync();
        Task<mensajeJson> VerificarCredenciales_OrdenCompraAsync(string usuario, string clave);
    }
}
