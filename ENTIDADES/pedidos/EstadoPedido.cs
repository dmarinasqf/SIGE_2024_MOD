using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("EstadoPedido", Schema = "Pedidos")]

    public class EstadoPedido
    {
        [Key]
        public string idestado { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
        public string descripcion { get; set; }
    }
}
