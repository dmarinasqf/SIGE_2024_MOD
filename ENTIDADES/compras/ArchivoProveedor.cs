using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.compras
{
    [Table("ArchivoProveedor", Schema = "Compras")]
   public class ArchivoProveedor:AuditoriaColumna
    {
        [Key]
        public int idarchivo { get; set; }
        public string nombre { get; set; }
        public string estado { get; set; }
        public string archivo { get; set; }
        public int idproveedor { get; set; }

        [ForeignKey("idproveedor")]
        public CProveedor proveedor { get; set; }
    }
}
