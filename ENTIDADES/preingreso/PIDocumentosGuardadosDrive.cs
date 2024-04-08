using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.Http;
namespace ENTIDADES.preingreso
{
    [Table("DocumentosGuardadosDrive", Schema = "PreIngreso")]
    public class DocumentosGuardadosDrive 
    {
        [Key]
        public int iddocumentoDrive { get; set; }
        public int idlote { get; set; }
        public int usucrea { get; set; }
        public int usumodi { get; set; }
        public string nombrecarpeta { get; set; }
        public string codigocarpeta { get; set; }
        public string nombrearchivo { get; set; }
        public string codigoarchivo { get; set; }
        public string previzualizacionarchivo { get; set; }
        public DateTime fechacreacion { get; set; }
        public DateTime fechaModificacion { get; set; }
    }
}
