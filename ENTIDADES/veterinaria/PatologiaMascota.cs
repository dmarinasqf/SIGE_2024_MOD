using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ENTIDADES.veterinaria
{
    [Table("Patologia", Schema = "veterinaria")]
    public class PatologiaMascota:AuditoriaColumna
    {
        [Key]
        public int idpatologia { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
