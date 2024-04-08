using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.produccion
{
    [Table("DIFICULTADFORMULA")]
    public class DificultadFormula:AuditoriaColumna
    {
        [Key]
        public int iddificultad { get; set; } 
        public string descripcion { get; set; }     
        public string estado { get; set; }     
    }
}
