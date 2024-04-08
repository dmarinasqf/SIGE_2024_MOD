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
    [Table("AlmacenProduccion", Schema = "Almacen")]
    public class AAlmacenProduccion: AuditoriaColumna
    {
        [Key]
        public int idmovimiento { get; set; }
        public string codigo { get; set; }
        public int idsucursal { get; set; }
        public int idalmacen { get; set; }
        public string observacion { get; set; }
        public int idempresa { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
