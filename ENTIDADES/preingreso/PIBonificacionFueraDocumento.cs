using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
    [Table("BonificacionFueraDocumento", Schema = "PreIngreso")]
    public class PIBonificacionFueraDocumento : AuditoriaColumna
    {
        [Key]
        public int id { get; set; }
        public string codigoingreso { get; set; }
        public int idfactura { get; set; }
        public string estado { get; set; }
        public string observacion { get; set; }
        public DateTime? fecha { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
        [ForeignKey("idfactura")]
        public PIFacturaPreingreso factura { get; set; }
    }
}
