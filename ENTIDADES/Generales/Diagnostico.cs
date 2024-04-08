using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    [Table("DIAGNOSTICO")]
    public class Diagnostico
    {
        [Key]
        [Column("diagnostico_codigo")]
        public int iddiagnostico { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }       
        public string estado { get; set; }
    }
}
