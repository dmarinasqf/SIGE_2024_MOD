using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Contabilidad
{
    public class Empleado
    {
        public int emp_codigo { get; set; }
        public string label{ get; set; }
        public int suc_codigo { get; set; }
        public string suc_descripcion { get; set; }
        public int idempresa { get; set; }
        public string emp_descripcion { get; set; }
    }
}
