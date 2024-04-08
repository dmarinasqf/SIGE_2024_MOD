using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    [Table("TIPOPACIENTE")]
    public class TipoPaciente
    {

        [Key]
        [Column("tipopaciente_codigo")]
        public int idtipopaciente { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }


    }
}
