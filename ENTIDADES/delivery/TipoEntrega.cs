using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.delivery
{
    [Table("TipoEntrega",Schema="Delivery")]
   public class TipoEntrega
    {
        [Key]
        public int idtipoentrega { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
