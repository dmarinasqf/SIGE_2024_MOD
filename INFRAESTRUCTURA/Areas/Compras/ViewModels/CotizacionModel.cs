using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.ViewModels
{
    public class CotizacionModel
    {
        
        public string IGV { get; set; }

        public List<FMoneda> monedas { get;  set; }
        public List<FCondicionPago> condicionpago { get;  set; }
        public List<ATipoProducto> tipoproducto { get;  set; }
        public List<CTipoCotizacion> tipocotizacion { get;  set; }
        public List<FIcoterms> icoterms { get;  set; }
        public List<FTipoPago> tipopago { get;  set; }
    }
}
