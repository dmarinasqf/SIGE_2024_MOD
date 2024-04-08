using ENTIDADES.Almacen;
using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using ENTIDADES.gdp;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
	[Table("historialdecomprasxproducto", Schema = "compras")]
	public class CHistorialPrecios : AuditoriaColumna {
		[Key]
		public int id { get; set; }
		public int idproducto { get; set; }
		public decimal vvf { get; set; }
		public decimal pvf { get; set; }
		public decimal cantidad { get; set; }
		public decimal subtotal { get; set; }
		public decimal total { get; set; }
		public decimal dsc1 { get; set; }
		public decimal dsc2 { get; set; }
		public decimal dsc3 { get; set; }
		public decimal bonificacion { get; set; }
		public decimal costofact { get; set; }
		public decimal costo { get; set; }
		public int idempresa { get; set; }
	}
}
