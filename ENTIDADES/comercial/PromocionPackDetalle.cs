using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1009
    public class PromocionPackDetalle
    {
        public int idpromocionpack { get; set; }
        public int idstock { get; set; }
        public int idproducto { get; set; }
        public int cantidad { get; set; }
        public int xfraccion { get; set; }
        public string estado { get; set; }
    }
}
