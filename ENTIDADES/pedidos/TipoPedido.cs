using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("TipoPedido")]

    public class TipoPedido
    {
        [Key]
        [Column("tipopedido_codigo")]
        public int idtipopedido { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
