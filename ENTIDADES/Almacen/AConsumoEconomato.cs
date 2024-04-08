using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("ConsumoEconomato", Schema = "Almacen")]
    public class AConsumoEconomato : AuditoriaColumna
    {
        [Key]
        public int idconsumoeconomato { get; set; }
        public string numdocumento { get; set; }
        public string motivo { get; set; }
        public string estado { get; set; }
        public int? suc_codigo { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
