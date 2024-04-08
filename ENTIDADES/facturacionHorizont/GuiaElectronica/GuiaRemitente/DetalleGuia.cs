using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.facturacionHorizont.GuiaElectronica.GuiaRemitente
{
    public class DetalleGuia
    {
        public int orden { get; set; }
        public string cantidad { get; set; }
        public string medida { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
    }
}
