using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.WorkerService.Areas.Finanzas.Dto
{
    class TipoCambio
    {
        public string servicio { get; set; }
        public string sitio { get; set; }
        public string enlace { get; set; }
        public List<Cotizacion> Cotizacion { get; set; }
    }
    class Cotizacion
    {
        public decimal Compra { get; set; }
        public decimal Venta { get; set; }
    }
}
