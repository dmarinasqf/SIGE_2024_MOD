using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("PagosPedido", Schema = "Pedidos")]

    public class PagosPedido : AuditoriaColumna
    {
        [Key]
        public int idpago { get; set; }       
        public int? idcuenta { get; set; }
        public int? idsucursal { get; set; }
        public int? idtipopago { get; set; }
        public int? idpedido { get; set; }  
        public string estado { get; set; }
        public string numoperacion { get; set; }
        public DateTime? fecha { get; set; }
        public decimal? monto { get; set; }
        public string imagen { get; set; }
        public string usuarioaprueba { get; set; }
        public string observacion { get; set; }
        public bool? validado { get; set; }
        public bool? isinterbancario { get; set; }
        public DateTime? fechaaprobacion { get; set; }
       

    }
}
