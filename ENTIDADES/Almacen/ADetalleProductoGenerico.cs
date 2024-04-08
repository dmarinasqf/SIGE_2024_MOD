using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("DetalleProductoGenerico", Schema = "Almacen")]
  public  class ADetalleProductoGenerico : AuditoriaColumna
    {
        [Key]
        public int iddetallegenerico { get; set; }
        public int? idproducto { get; set; }
        public int? idproductogenerico { get; set; }
        public string descripcion { get; set; }
        public string codconcentracion { get; set; }

        [NotMapped]
        public string unidadmedida { get; set; }
        [NotMapped]
        public string nombreabreviado { get; set; }

    }
}
