using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("DocumentoTributario", Schema = "Finanzas")]
   public class FDocumentoTributario: AuditoriaColumna
    {
        [Key]
        public int iddocumento { get; set; }
        public string descripcion { get; set; }
        public string correlativo { get; set; }

        public string estado { get; set; }     
        public string codigosunat { get; set; }     
       
    }
}
