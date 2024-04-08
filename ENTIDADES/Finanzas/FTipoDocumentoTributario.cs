using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.finanzas
{
    [Table("TipoDocumentoTributario", Schema = "Finanzas")]

    public class FTipoDocumentoTributario
    {
        [Key]
        public int idtipodocumento { get; set; }
        public int iddocumento { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string codigosunat { get; set; }
        [ForeignKey("iddocumento")]
        public FDocumentoTributario documento { get; set; }
    }
}
