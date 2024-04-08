using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("DescuentoSucursal", Schema = "Comercial")]
    public class DescuentoSucursal:AuditoriaColumna
    {
        [Key]
        public int id { get; set; }
        public int idsucursal { get; set; }
        public int iddescuento { get; set; }
        public string estado { get; set; }
    }
}
