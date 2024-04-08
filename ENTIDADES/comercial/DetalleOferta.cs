using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("DetalleOferta", Schema = "Comercial")]

    public class DetalleOferta
    {
        [Key]
        public int iddetalle { get; set; }
        public int idoferta { get; set; }
        public int idproducto { get; set; }
        public bool? isfraccion { get; set; }
        public int? cantidad { get; set; }
        public decimal? monto { get; set; }
        public string estado { get; set; }

        [ForeignKey("idoferta")]
        public Oferta oferta { get; set; }
        [ForeignKey("idproducto")]
        public AProducto    producto { get; set; }
    }
}
