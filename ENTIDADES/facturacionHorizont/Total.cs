using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class Total
    {
        public decimal total_igv { get; set; }
        public decimal total_descuentos { get; set; }
        public decimal total_otros_cargos { get; set; }
        //subttotal +total_exoneradas+total_inafectadas
        public string importe_total { get; set; }//sinigv
        //importe_total-total_descuentos+total_otros_cargos
        public decimal total_total { get; set; }

        public decimal total_impuestos { get; set; }
        public decimal total_exoneradas { get; set; }
        public decimal total_inafectadas { get; set; }
        //sinigv
        //sub total
        public string total_valor_venta { get; set; }


        public decimal importe_total_con_impuestos { get; set; }
        public string total_precio_venta { get; set; }
        public decimal monto_redondeo_importetotal { get; set; }
        public decimal total_anticipos { get; set; }

    }
}
