using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
    [Table("FacturaPreingreso", Schema = "PreIngreso")]
    public class PIFacturaPreingreso : AuditoriaColumna
    {
        [Key]
        public int idfactura { get; set; }
        public int idpreingreso { get; set; }
        public string serie { get; set; }
        public string numdoc { get; set; }
        public DateTime fecha { get; set; }
        public string estado { get; set; }
        public int? iddocumento { get; set; }
        public DateTime? fechaaprobacion { get; set; }
        public string usuarioaprueba { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? ncxdevolucion { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? ncxdiferenciadesc { get; set; }
        public string observacion { get; set; }
        public string usuarioanula { get; set; } 
        public DateTime? fechaanulacion { get; set; }
        public string usuariovalida { get; set; }
        public DateTime? fechavalidacion { get; set; }
        public string estadonotacredito { get; set; }
        public string usuarionotacredito { get; set; }
        public DateTime? fechanotacredito { get; set; }
        public int? idproveedor { get; set; }

        [ForeignKey("idpreingreso")]
        public PIPreingreso preingreso { get; set; }
        [ForeignKey("iddocumento")]
        public FDocumentoTributario documento { get; set; }
    }
}
