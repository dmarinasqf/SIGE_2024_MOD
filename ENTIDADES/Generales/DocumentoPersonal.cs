using System;
using System.Collections.Generic;
namespace ENTIDADES.Generales
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("TIPODOCUMENTOCLIENTE")]
    public class DocumentoPersonal:AuditoriaColumna
    {
        [Key]
        [Column("TDC_codigo")]
        public int iddocumento { get; set; }
        public string descripcion { get; set; }
        public string codigosunat { get; set; }
        public string estado { get; set; }
        public int longitud { get; set; }
    }
}
