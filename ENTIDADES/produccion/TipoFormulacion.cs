using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.produccion
{
    [Table("TipoFormulacion",Schema ="Produccion")]
    public class TipoFormulacion
    {
        [Key]
        public string idtipoformulacion { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
