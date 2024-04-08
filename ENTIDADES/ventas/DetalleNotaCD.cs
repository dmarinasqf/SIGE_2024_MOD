using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("DetalleNotaCD", Schema = "Ventas")]

    public class DetalleNotaCD
    {
        [Key]
        public int iddetalle { get; set; }
        public int idnota { get; set; }
        public long? idstock { get; set; }
        public long? idprecioproducto { get; set; }
        public int cantidad { get; set; }
        public decimal? precio { get; set; }
        public decimal? precioigv { get; set; }
        public bool? isfraccion { get; set; }
        public bool? isblister { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
        [ForeignKey("idnota")]
        public NotaCD nota { get; set; }
        [ForeignKey("idstock")]
        public AStockLoteProducto stock { get; set; }     
        [ForeignKey("idprecioproducto")]
        public PreciosProducto precioproducto { get; set; }
        public int? idpackPedidoVenta { get; set; }
        public int? idclientedescuentoglobal { get; set; }
    }
}
