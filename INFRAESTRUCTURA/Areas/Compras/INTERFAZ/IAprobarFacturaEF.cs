using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using ENTIDADES.compras;
using ENTIDADES.preingreso;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
    public interface  IAprobarFacturaEF
    {
        Task<mensajeJson> AprobarFacturaAsync(PIFacturaPreingreso factura, PIPreingreso preingreso, List<PIPreingresoDetalle> detalle, List<CCotizacionDetalle> cotizaciondetalle, List<PreciosProducto> precioslistas,string jsonstock,List<CHistorialPrecios> historial, List<AAlmacenSucursal> lAlmacenSucursal);
        mensajeJson VerificarCredenciales_AprobarFactura(string usuario, string clave);
        Task<mensajeJson> AnularFacturaAsync(int idpreingreso, int idfactura, string jsonpreingreso, string jsonfactura);
        Task<mensajeJson> AnularGuiaAsync(int idpreingreso, int idfactura, string jsonfactura);
        Task<mensajeJson> ValidarAnalisisOrganolepticoAsync(int idfactura);
        Task<mensajeJson> ValidarNotaDeCreditoAsync(int idfactura, string estadoNC);
    }
}
