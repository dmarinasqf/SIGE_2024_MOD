using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("CotizacionDetalle", Schema = "Compras")]
   public class CCotizacionDetalle
    {		

		public int idcotizacion { get; set; }
		public int? idlaboratorio { get; set; }
		[Key]
		public int iddetallecotizacion { get; set; }
		public int? idproductoproveedor { get; set; }

		public int idproducto { get; set; }
		public int cantidad { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? pvf { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? vvf { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? des1 { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? des2 { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? des3 { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? des4 { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? des5 { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? bonificacion { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? montofacturar { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? costo { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? total { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? subtotal { get; set; }
		public decimal? equivalencia { get; set; }
		public int? iduma { get; set; }
		public int? idump { get; set; }
		public string estado { get; set; }
		public int? idmoneda { get; set; }
		public decimal? cambio { get; set; }

		[NotMapped]
		public AProducto producto { get; set; }
		[NotMapped]
		public CProductoProveedor productoproveedor { get; set; }
		[NotMapped]
		public decimal? _equivalencia { get; set; }
		[NotMapped]
		public string uma { get; set; }
		[NotMapped]
		public string ump { get; set; }
		[NotMapped]
		public string laboratorio { get; set; }
		[NotMapped]
		public int? index { get; set; }
		[NotMapped]
		public CBonificacionCotizacion[] bonificaciones { get; set; }
		[NotMapped]
		public string tipoingreso { get; set; }

	}
}
