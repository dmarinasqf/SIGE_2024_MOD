using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Transporte
{
	[Table("Conductor", Schema = "Transporte")]
	public class TConductor : AuditoriaColumna
	{
		[Key]
		public int idconductor { get; set; }
		public string documentoidentidad { get; set; }
		public string licencia { get; set; }
		public string tipolicencia { get; set; }
		public string nombres { get; set; }
		public string direccion { get; set; }
		public DateTime? fechanacimiento { get; set; }
		public string telefono { get; set; }
		public string email { get; set; }
		public int idvehiculo { get; set; }
		public string estado { get; set; }

	}
}
