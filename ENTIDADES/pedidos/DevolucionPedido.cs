using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("Devoluciones")]
    public class DevolucionPedido
    {
        [Key]
        [Column("dev_codigo")]

        public int iddevolucion { get; set; }
        [Column("pedido_codigo")]
        public int idpedido { get; set; }
        public int? usuariodevuelve { get; set; }
        public DateTime? fechadevolucion { get; set; }
        public DateTime? fechaaceptacion { get; set; }
        public string motivodevolucion { get; set; }
        public int? quimicoacepta { get; set; }
        public int? sucursalenvia { get; set; }
        public int? sucursalrecibe { get; set; }
        [ForeignKey("idpedido")]
        public Pedido pedido { get; set; }
    }
}
