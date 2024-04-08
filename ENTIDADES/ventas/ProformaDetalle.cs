using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("ProformaDetalle", Schema = "Ventas")]
    public class ProformaDetalle
    {
        [Key]
        public long iddetalleproforma { get; set; }
        public long? idstock { get; set; }
        public int? idproducto { get; set; }
        public long idproforma { get; set; }
        public string estado { get; set; }
        public int cantidad { get; set; }
        public decimal? precio { get; set; }
        public decimal? precioigv { get; set; }
        public bool? isfraccion { get; set; }
        public bool? isblister { get; set; }
        public long? idprecioproducto { get; set; }
        public decimal? incentivo { get; set; }
        public string tipo { get; set; }
        public string formulacion { get; set; }
        public decimal? descu { get; set; }

        [ForeignKey("idprecioproducto")]
        public PreciosProducto precioproducto { get; set; }

        [ForeignKey("idstock")]
        public AStockLoteProducto stock { get; set; }
        [ForeignKey("idproforma")]
        public Proforma proforma { get; set; }
    }
}
