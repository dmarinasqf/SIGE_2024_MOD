using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("TipoPago", Schema = "Finanzas")]
    public class FTipoPago:AuditoriaColumna
    {
        [Key]
        public int idtipopago { get; set; }
        public string descripcion { get; set; }
     
        public string estado { get; set; }
    }
}
