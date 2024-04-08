using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.INTERFAZ
{
    public interface IVentaEF
    {
        public  Task<mensajeJson> RegistrarVentaDirectaAsync(Venta venta);
        public  Task<mensajeJson> AnularVenta(long idventa);
        public string devolverstockdeventa(long idventa);
        public Task<mensajeJson> RegistrarVentaManualAsync(Venta venta);
        public string[] ObtenerUltimoSerieNumDocumentoManual(int idsucursal);
    }
}
