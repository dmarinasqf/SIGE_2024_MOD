using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Generales
{
    [Table("CargoEmpleado")]
    public class CargoEmpleado
    {
        [Key]
        public int idcargo { get; set; }
        public string estado { get; set; }
        public string descripcion { get; set; }
    }
}
