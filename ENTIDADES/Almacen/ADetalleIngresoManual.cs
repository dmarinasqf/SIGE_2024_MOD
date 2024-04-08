using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("DetalleIngresoManual", Schema = "Almacen")]

    public class ADetalleIngresoManual
    {
        [Key]
        public int iddetalle { get; set; }
        public int idingreso { get; set; }
        public int? cantidad { get; set; }
        public bool? isblister { get; set; }
        public bool? isfraccion { get; set; }
        public int idproducto { get; set; }
        public long? idstock { get; set; }
        public string estado { get; set; }
        public string lote { get; set; }
        public string regsanitario { get; set; }
        public DateTime? fechavencimiento { get; set; }
        public int? idalmacensucursal { get; set; }

        [ForeignKey("idingreso")]
        public AIngresoManual ingreso { get; set; }
        [ForeignKey("idstock")]
        public AStockLoteProducto stockobj { get; set; }
        [ForeignKey("idproducto")]
        public AProducto    producto { get; set; }
        [ForeignKey("idalmacensucursal")]
        public AAlmacenSucursal    objalmacen { get; set; }

    }
}
