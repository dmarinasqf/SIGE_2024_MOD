using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("DetallePedidoEstadoProceso", Schema = "Pedidos")]
    public class DetallePedidoEstadoProceso : AuditoriaColumna
    {
        [Key]
        public int iddetallepedidoestadoproceso { get; set; }
        public int detp_codigo { get; set; }
        public string estadoproceso { get; set; }
        public DateTime fecha { get; set; }
        public string estado { get; set; }
    }
}
