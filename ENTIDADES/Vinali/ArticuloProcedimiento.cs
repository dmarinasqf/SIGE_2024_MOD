using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Vinali
{
    [Table("ARTICULO")]

    public class ArticuloProcedimiento
    {
        [Key]
        public int articulo_codigo { get; set; }
        public string descripcion { get; set; }
        public string unidadmedida { get; set; }
        public decimal? precio { get; set; }
        public string codigoproducto { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
        public int? stock { get; set; }
        [NotMapped]
        public int index { get; set; }
    }
}
