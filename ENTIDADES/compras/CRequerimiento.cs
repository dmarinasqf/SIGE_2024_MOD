using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.compras
{
    [Table("Requerimiento", Schema = "Compras")]
    public class CRequerimiento : AuditoriaColumna
    {
        [Key]
        public int idrequerimiento { get; set; }
        public int suc_codigo { get; set; }
        public int emp_codigo { get; set; }
        public int idgrupo { get; set; }
        public string descripcion { get; set; }
        public int idordencompra { get; set; }
        public string estado { get; set; }

        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
