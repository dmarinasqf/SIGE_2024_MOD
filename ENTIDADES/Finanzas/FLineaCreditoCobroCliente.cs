using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.finanzas
{
    [Table("LineaCreditoCobroCliente", Schema = "Finanzas")]

    public class FLineaCreditoCobroCliente:AuditoriaColumna
    {
        [Key]
        public int idcobro { get; set; }
        public int idoperacion { get; set; }
        public string tabla { get; set; }
        public int idcliente { get; set; }
        public bool ispagado { get; set; }
        public decimal? total { get; set; }
    }
}
