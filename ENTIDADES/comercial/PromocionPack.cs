using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1009
    public class PromocionPack
    {
        public string idpromopack { get; set; }
        public string codigopromopack { get; set; }
        public string nombrepromocion { get; set; }
        public string descripcion { get; set; }
        public decimal precioventa { get; set; }
        public decimal incentivo { get; set; }
        public decimal tipo { get; set; }
        public string usuariocrea { get; set; }
        public string usuariomodifica { get; set; }
        public DateTime fechainicio { get; set; }
        public DateTime fechatermino { get; set; }
        //----------------------------------------
        public string idlistaprecio { get; set; }
        public decimal precio { get; set; }
        public int idempleado { get; set; }
        //----------------------------------------
        public List<PromocionPackDetalle> detalle { get; set; }
        public List<PromocionPackCanalVenta> canalventas { get; set; }
        public List<PromocionPackSucursal> sucursales { get; set; }

        public decimal? precioSindescuento { get; set; }
        public decimal? cantidadDescuento { get; set; }
        public decimal? porcentajedescuento { get; set; }





    }
}
