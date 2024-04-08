using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ENTIDADES.veterinaria
{
    [Table("Raza", Schema = "veterinaria")]

    public class RazaMascota: AuditoriaColumna
    {
        [Key]
        public int idraza { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public int? idtipomascota { get; set; }
        [ForeignKey("idtipomascota")]
        public TipoMascota tipomascota { get; set; }
        [NotMapped]
        public string tmascota { get; set; }
    }
}
