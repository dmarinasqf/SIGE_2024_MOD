using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("PreciosDetalle", Schema = "Comercial")]

    public class PreciosDetalle
    {
        [Key]
        public int iddetalle { get; set; }
        public long idprecioproducto { get; set; }
        public string formulacion { get; set; }
        public string presentacion { get; set; }
        public string etiqueta { get; set; }
        public string observacion { get; set; }
        public string codigo { get; set; }

        [ForeignKey("idprecioproducto")]
        public PreciosProducto precioproducto { get; set; }
    }
}
