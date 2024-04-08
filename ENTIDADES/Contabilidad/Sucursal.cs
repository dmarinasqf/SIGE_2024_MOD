using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Contabilidad
{
    public class Sucursal
    {
        public int suc_codigo { get; set; }
        public string suc_descripcion { get; set; }
        public int emp_idempresa { get; set; }
        public string emp_descripcion { get; set; }
    }
}
