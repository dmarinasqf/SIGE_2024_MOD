using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{

    [Table("DetalleOrdenCompra", Schema = "Compras")]
    public  class COrdenDetalle
    {
        [Key]
        public int idordendetalle { get; set; }
        public int idordencompra { get; set; }
        public int iddetallecotizacion { get; set; }
        public string estado  { get; set; }
        [NotMapped]
        public bool? tienepreingreso { get; set; }
        [NotMapped]
        public CCotizacionDetalle detallecotizacion { get; set; }
    }
}
