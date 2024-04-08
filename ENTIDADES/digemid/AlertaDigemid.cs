using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.digemid
{
    [Table("AlertaDigemid", Schema = "Digemid")]
    public class AlertaDigemid:AuditoriaColumna

    {
        [Key]
        public int idalerta { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string archivo { get; set; }
        public DateTime? fecha { get; set; }
    }
}
