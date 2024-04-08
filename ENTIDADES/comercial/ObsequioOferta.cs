using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("ObsequioOferta", Schema = "Comercial")]

    public class ObsequioOferta
    {
        [Key]
        public int idobsequio { get; set; }
        public int idoferta { get; set; }
        public int idproducto { get; set; }
        public bool? isfraccion { get; set; }
        public int? cantidad { get; set; }
        public decimal? descuento { get; set; }
        public string estado { get; set; }
        [ForeignKey("idoferta")]
        public Oferta oferta { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
    }
}
