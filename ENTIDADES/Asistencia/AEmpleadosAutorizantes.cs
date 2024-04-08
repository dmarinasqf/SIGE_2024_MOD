using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Asistencia
{
    [Table("EmpleadosAutorizantes", Schema= "asistencia")]
    public class AEmpleadosAutorizantes
    {
        [Key]
        public int idEmpleadoA { get; set; }
        public int emp_codigo { get; set; }
        public string nombres { get; set; }
        public string documento { get; set; }
        public int usuarioCrea { get; set; }
        public DateTime? fechaCreado { get; set; }
        public int usuarioModifica { get; set; }
        public DateTime? fechaModifica { get; set; }
        public string estado { get; set; }
    }
}
