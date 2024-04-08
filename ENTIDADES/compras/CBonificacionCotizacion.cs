using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("BonificacionCotizacion", Schema = "Compras")]
    public class CBonificacionCotizacion
    {
        [Key]
        public int idbonificacion { get; set; }
        public int iddetallecotizacion { get; set; }
        public int cantidad { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? precio { get; set; }
        public string estado { get; set; }
        public int? idproducto { get; set; }
        public string tipo { get; set; }
        public string promocion { get; set; }
        [NotMapped]
        public int index { get; set; }
        [NotMapped]
        public string producto { get; set; }
    }
}
