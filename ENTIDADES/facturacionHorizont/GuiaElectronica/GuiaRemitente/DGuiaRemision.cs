using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.facturacionHorizont.GuiaElectronica.GuiaRemitente
{
    public class DGuiaRemision
    {
        public string tipo_documento { get; set; }
        public string serie { get; set; }
        public string numdocumento {get;set;}
        public string fecha_emision { get; set; }
        public string observaciones { get; set; }

    }
}
