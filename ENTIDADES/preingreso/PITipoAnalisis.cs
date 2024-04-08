using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("TipoAnalisis", Schema = "PreIngreso")]
	public class PITipoAnalisis : AuditoriaColumna
    {
		[Key]
		public int idtipoanalisis { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }
	

	}
}
