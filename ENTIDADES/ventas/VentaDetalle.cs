using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("VentaDetalle", Schema = "Ventas")]
    public  class VentaDetalle
    {
        [Key]
        public long idventadetalle { get; set; }
        public long idventa { get; set; }
        public long? idstock { get; set; }
        public long? idprecioproducto { get; set; }
        public int? idproducto { get; set; }
        public int cantidad { get; set; }
        [Column(TypeName = "decimal(18, 6)")]
        public decimal? precio { get; set; }
        [Column(TypeName = "decimal(18, 6)")]

        public decimal? precioigv { get; set; }
        public decimal? descuento { get; set; }
        public bool? isfraccion { get; set; }
        public bool? isblister { get; set; }
        public string estado { get; set; }
        public decimal? incentivo { get; set; }
        public string tipo { get; set; }
        public int? idlistadescuento { get; set; }
        public int? idpromopack { get; set; }

        [ForeignKey("idstock")]
        public AStockLoteProducto stock { get; set; }
        
        [ForeignKey("idventa")]
        public Venta venta { get; set; }
        [ForeignKey("idprecioproducto")]
        public PreciosProducto precioproducto { get; set; }
        public int? idpackPedidoVenta { get; set; }
        public int? detp_codigo { get; set;  }




    }
}
