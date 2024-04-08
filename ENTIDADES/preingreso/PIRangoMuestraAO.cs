using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("RangoMuestraAO", Schema = "PreIngreso")]
	public class PIRangoMuestraAO : AuditoriaColumna
    {
		[Key]
		public int idrango { get; set; }
		public int intervaloinicial { get; set; }
		public int intervalofinal { get; set; }
		public int numeromuestra { get; set; }
		public string estado { get; set; }

	}
}
