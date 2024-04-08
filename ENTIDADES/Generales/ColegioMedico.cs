using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    [Table("Colegio")]
    public class ColegioMedico : AuditoriaColumna
    {
        [Key]
        public int idcolegio { get; set; }
        public string abreviatura { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public int? nmrdigitos { get; set; }

    }
}
