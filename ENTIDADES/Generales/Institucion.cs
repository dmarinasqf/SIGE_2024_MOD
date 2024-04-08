using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Generales
{
    [Table("INSTITUCION")]
    public class Institucion : AuditoriaColumna
    {
        [Key]
        public int idInstitucion { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
