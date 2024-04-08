using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.ViewModels
{
    public class OrdenCompraModel
    {
        public string IGV { get; set; }
        public string PERCEPCION { get; set; }

        public List<FMoneda> monedas { get; set; }
        public List<FCondicionPago> condicionpago { get;  set; }
        public List<FTipoPago> tipopago { get;  set; }
        public List<SUCURSAL> sucursales { get;  set; }
        public List<FIcoterms> icoterms { get;  set; }
        public int? idalmacensucursal { get; set; }
    }
}
