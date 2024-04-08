using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.finanzas
{
    [Table("LineaCreditoHistorial", Schema = "Finanzas")]

    public class FLineaCreditoHistorial:AuditoriaColumna
    {
        [Key]
        public int idhistorial { get; set; }
        public string estado { get; set; }
        public int idcliente { get; set; }
        public decimal? montoingresado { get; set; }
        public decimal? montoactual { get; set; }
    }
}
