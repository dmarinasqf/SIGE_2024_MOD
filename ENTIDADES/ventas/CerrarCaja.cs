using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{

    [Table("CerrarCaja", Schema = "Ventas")]
    public class CerrarCaja:AuditoriaColumna
    {
        [Key]
        public int idcierre { get; set; }
        public int idaperturarcaja { get; set; }
        public string estado { get; set; }
        public decimal? montosistema { get; set; }
        public decimal? montousuario { get; set; }
        public DateTime? fecha { get; set; }
        public string caja { get; set; }
        public string moneda { get; set; }
        public string tipopago { get; set; }
        public decimal? cambiomoneda { get; set; }
        public int numventas { get; set; }
        [ForeignKey("idaperturarcaja")]
        public AperturarCaja aperturarcaja { get; set; }
    }
}
