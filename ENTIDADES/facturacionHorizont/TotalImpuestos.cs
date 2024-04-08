using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
   public class TotalImpuestos
    {
        public string total_impuesto { get; set; }
        public decimal total_exportacion { get; set; }
        public decimal tributos_operaciones_exportaciones { get; set; }
        public string total_inafectada { get; set; }
        public decimal tributos_operaciones_inafectadas { get; set; }
        public string total_exonerada { get; set; }
        public decimal tributos_operaciones_exoneradas { get; set; }
        public decimal total_operaciones_gratuitas { get; set; }
        public decimal tributos_operaciones_gratuitas { get; set; }
        public string total_gravadas_igv { get; set; }
        public string tributos_gravadas_igv { get; set; }
        public decimal total_gravadas_IVAP { get; set; }
        public decimal tributos_gravadas_IVAP { get; set; }
        public decimal total_ISC { get; set; }
        public decimal tributos_ISC { get; set; }
        public decimal total_otros_tributos { get; set; }
        public decimal tributos_otros_tributos { get; set; }






    }
}
