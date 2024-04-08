using System;
using System.Collections.Generic;
using System.Text;

namespace Erp.Report.Dtos.Ventas
{
    public class Proformadto
    {

    }
   public class ProformaCabeceraDto
    {
        public string cliente { get; set; }
        public string paciente { get; set; }
        public string fecha { get; set; }
        public string codigoproforma { get; set; }
        public decimal total { get; set; }

    }
    public class ProformaDetalleDto
    {
        public int num { get; set; }
        public string producto { get; set; }
        public string cantidad { get; set; }
        public decimal? precio { get; set; }
        public decimal? subtotal { get; set; }
    }
}
