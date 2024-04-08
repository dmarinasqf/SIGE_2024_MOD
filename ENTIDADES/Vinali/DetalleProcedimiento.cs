using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Vinali
{
    [Table("DETALLE_PROCEDIMIENTO")]

    public class DetalleProcedimiento
    {
        public int? procedimiento_codigo { get; set; }

        [Key]
        public int detalleproc_codigo { get; set; }

        public double? costo { get; set; }

        public int? tipodeproc_codido { get; set; }       
        public string estado { get; set; }

        [NotMapped]
        public int index { get; set; }
        [NotMapped]
        public string estadoDP { get; set; }

        [ForeignKey(nameof(tipodeproc_codido))]
        public virtual TipoDeProcedimiento tipoProcedimiento { get; set; }
    }
}
