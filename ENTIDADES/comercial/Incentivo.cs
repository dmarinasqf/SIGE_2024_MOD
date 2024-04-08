using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("Incentivo", Schema = "Comercial")]
    public class Incentivo:AuditoriaColumna
    {
        public int id { get; set; }
        public int idproducto { get; set; }
        public int idsucursal { get; set; }
        public decimal? incentivo { get; set; }
        public decimal? incentivoreceta { get; set; }
        public decimal? incentivoxfraccion { get; set; }
        public DateTime? fechainicio { get; set; }
        public DateTime? fechafin { get; set; }

        [NotMapped]
        public string codigoproducto { get; set; }
    }
}
