using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("AlmacenEmpleado_v1", Schema= "Almacen")]
    public class AEmpleadoAlmacen
    {
        [Key]
        public int idalmacenempleado { get; set; }
        public int emp_codigo { get; set; }
        public int idalmacen { get; set; }
        public int idareaalmacen { get; set; }
        public string fechacreacion { get; set; }
        public string fechaedicion { get; set; }   
        public string estado { get; set; }
    }
}
