using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Contabilidad
{
    public class AsignacionCajaHistorico
    {
        public decimal monto { get; set; }
        public string montoCajaTipo{ get; set; }
        public string usuario_op { get; set; }
        public string fecha_modificacion { get; set; }
    }
}
