using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("Imagen_Pedido")]

    public class ImagenPedido
    {
        [Key]        
        [Column("imagen_codigo")]
        public int idimagen { get; set; }
        [Column("pedido_codigo")]
        public int idpedido { get; set; }
        public string tipo { get; set; }
        public string imagen { get; set; }
        [ForeignKey("idpedido")]
        public Pedido pedido { get; set; }
    }
}
