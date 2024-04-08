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
	[Table("Centroscosto", Schema = "dbo")]
	public class Centroscosto : AuditoriaColumna {
		[Key]
		public string idempresa { get; set; }
		public string idcodicentcost { get; set; }
		public string nombrecentcost { get; set; }
		public string estado { get; set; }
	}
}
