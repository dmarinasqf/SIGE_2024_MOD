using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1009
    [Table("PromocionPackPedidoDetalle", Schema = "Comercial")]
    public class PromocionPackPedidoDetalle
    {
        [Key]
        public int idpromopedidodet { get; set; }
        public int idpedido { get; set; }
        public int idpromopack { get; set; }
        public int idstock { get; set; }
        public int cantidad { get; set; }
        public int xfraccion { get; set; }
        public int idprecioproducto { get; set; }
    }
}
