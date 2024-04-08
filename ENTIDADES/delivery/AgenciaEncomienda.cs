using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.delivery
{
    [Table("AgenciaEncomienda")]
    public class AgenciaEncomienda:AuditoriaColumna
    {
        [Key]
        public int idagencia { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
