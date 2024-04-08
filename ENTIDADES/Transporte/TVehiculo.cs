using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Transporte
{
		[Table("Vehiculo", Schema = "Transporte")]
		public class TVehiculo : AuditoriaColumna
		{
		[Key]
			public int idvehiculo { get; set; }
			public string marca { get; set; }
			public string modelocarro { get; set; }
			public string matricula { get; set; }
			public int idempresa { get; set; }
			public string documentoidentidad { get; set; }
			public string licencia { get; set; }
			public string tipolicencia { get; set; }
			public string nombres { get; set; }
			public string direccion { get; set; }
			public string telefono { get; set; }
			public string estado { get; set; }
			
		}
}
