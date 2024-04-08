using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("ControlCalidad", Schema = "PreIngreso")]
	public class PIControlCalidad: AuditoriaColumna
    {
		[Key]
		public long idcontrolcalidad { get; set; }
		public string codigocontrolcalidad { get; set; }
		public int idpreingreso { get; set; }
		public int? idquimicofarmaceutico { get; set; }
		public DateTime? fecha { get; set; }		
		public int ano { get; set; }		
		public string observacion { get; set; }		
		public string estado { get; set; }		
	}
}
