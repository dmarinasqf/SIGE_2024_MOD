using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ENTIDADES.veterinaria
{
    [Table("TipoMascota", Schema = "veterinaria")]

    public class TipoMascota : AuditoriaColumna
    {
        [Key]
        public int idtipomascota { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
