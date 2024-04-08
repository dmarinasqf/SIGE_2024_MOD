using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.facturacionHorizont.GuiaElectronica.GuiaRemitente
{
    public class DEnvio
    {
        public string tipo_traslado { get; set; }
        public string motivo_traslado { get; set; }
        public string transbordo { get; set; }
        public string peso_total { get; set; }
        public string medida { get; set; }
        public string pallets { get; set; }
        public string traslado { get; set; }
        public string fecha_traslado { get; set; }

    }
}
