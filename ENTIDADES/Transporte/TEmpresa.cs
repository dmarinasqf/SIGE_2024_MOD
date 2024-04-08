using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Transporte
{
		[Table("Empresa", Schema = "Transporte")]
		public class TEmpresa : AuditoriaColumna
		{
			
			[Key]
			public int idempresa { get; set; }
			public string ruc { get; set; }
			public string razonsocial { get; set; }
			public string direccionfiscal { get; set; }
			public string email { get; set; }
			public string telefono { get; set; }
			public string estado { get; set; }
		}
}
