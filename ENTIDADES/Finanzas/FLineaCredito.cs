using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.finanzas
{
    [Table("LineaCredito", Schema = "Finanzas")]

    public class FLineaCredito:AuditoriaColumna
    {
        [Key]
        public int idcliente { get; set;  }
        public int idmoneda { get; set; }
        public int idcondicionpago { get; set; }
        public decimal? montoactual { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }
        public bool isbloqueado { get; set; }

        [NotMapped]
        public decimal nuevocredito { get; set; }

    }
}
