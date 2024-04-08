using ENTIDADES.comercial;
using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.Interfaz
{
    public interface IDescuentoEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(Descuento descuento, List<DescuentoDetalle> detalle, string canalVentas);
        public  Task<mensajeJson> RegistrarEditarValidacionUsuario(string usuario, string clave, Descuento descuento, List<DescuentoDetalle> detalle,string canalventas);
        public object ListarSucursalDescuento(int iddescuento);
        public mensajeJson AsignarDescuentoSucursalEnBloque(int iddescuento, List<string> idsucursal);
        public  Task<mensajeJson> EditarDescuentoAsync(Descuento descuento, List<string> detalle);
    }
}
