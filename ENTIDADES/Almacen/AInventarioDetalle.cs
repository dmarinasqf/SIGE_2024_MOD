using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("InventarioDetalle", Schema = "Almacen")]
    public class AInventarioDetalle : AuditoriaColumna
    {
        [Key]
        public int idinventariodetalle { get; set; }
        public int idinventario { get; set; }
        public int idstock { get; set; }
        //public int cantidadanterior { get; set; }
        public int cajas { get; set; }
        public int unidad { get; set; }
        public string estado { get; set; }
    }
}
