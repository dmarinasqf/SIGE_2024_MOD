using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.finanzas
{
    [Table("TipoTributo", Schema = "Finanzas")]

    public class FTipoTributo
    {
        [Key]
        public string idtipotributo { get; set; }
        public string descripcion { get; set; }
        public string nombre { get; set; }
        public string estado { get; set; }
        public string codigoafectacionigv { get; set; }
        public string ecenametributo { get; set; }
        public string ececodtributo { get; set; }
    }
}
