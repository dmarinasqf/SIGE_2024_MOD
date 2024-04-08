using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1009
    public class PromocionPackSucursal
    {
        public int suc_codigo { get; set; }
        public int idpromopack { get; set; }
        public string? fechainicio { get; set; }
        public string? fechatermino { get; set; }
    }
}
