using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("DETALLE_PEDIDO")]

    public class DetallePedido:AuditoriaColumna
    {
        [Key]
        [Column("detp_codigo")]
        public int iddetalle { get; set; }
        [Column("pedido_codigo")]
        public int? idpedido { get; set; }
       
        public decimal? precio { get; set; }
        public int? cantidad { get; set; }
        public bool? isfraccion { get; set; }
        public decimal? subtotal { get; set; }
        public string descripcion { get; set; }      
        public string codigoprecio { get; set; }
        public int? iddificultad { get; set; }
        public int? idprecioproducto { get; set; }
        public int? idproducto { get; set; }
        public int? idstock { get; set; }
        public string tipoitem { get; set; }
        public string estado { get; set; }
        [Column("catalago_codigo")]
        public int? idprecioproductoanterior { get; set; }
        public int? idpromopack { get; set; }//EARTCOD1009
        public int? idformulador { get; set; }
        public int? idlaboratorio { get; set; }
        //public string estadoProceso { get; set; }
        public int? iddetallepedidoestadoproceso { get; set; }
        public string? idtipoformulacion { get; set; }
        public int? tipopedido_codigo { get; set; }

        public int? cantidadPacks { get; set; }
        public int? idpackPedidoVenta { get; set; }
        

    }
}
