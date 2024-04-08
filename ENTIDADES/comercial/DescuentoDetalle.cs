using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("DescuentoDetalle", Schema = "Comercial")]
    public class DescuentoDetalle
    {
        [Key]
        public int iddetalle { get; set; }
        public int iddescuento { get; set; }
        public int idproducto { get; set; }
        public string tipo { get; set; }
        public string estado { get; set; }
        public int? cantidad { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
