using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Vinali
{
    [Table("DETALLEPROCEDIMIENTOARTICULO")]
    public  class DetalleProcedimientoArticulo
    {
        public int? detalleproc_codigo { get; set; }

        public int? articulo_codigo { get; set; }

        [Key]
        public int procarticulo_codigo { get; set; }
        public int? cantidad { get; set; }        
        public string estado { get; set; }

        [NotMapped]
        public int index { get; set; }

        [ForeignKey(nameof(articulo_codigo))]
        public virtual ArticuloProcedimiento articulo { get; set; }
        [NotMapped]
        public string estadoRE { get; set; }
    }
}
