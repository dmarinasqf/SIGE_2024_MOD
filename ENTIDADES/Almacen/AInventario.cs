using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("Inventario", Schema = "Almacen")]
    public class AInventario : AuditoriaColumna
    {
        [Key]
        public int idinventario { get; set; }
        public int suc_codigo { get; set; }
        public int idalmacensucursal { get; set; }
        public int idlaboratorio { get; set; }
        public int usuarioinicia { get; set; }
        public DateTime fechainicio { get; set; }
        public int usuariofinaliza { get; set; }
        public DateTime fechafin { get; set; }
        public string estado { get; set; }

        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
