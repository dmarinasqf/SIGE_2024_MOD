using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("CaracteristicaDetalleAO", Schema = "PreIngreso")]
	public class PICaracteristicaDetalleAO : AuditoriaColumna
    {
		[Key]
		public long idcaracteristicadetalleao { get; set; }
		public int idcaracteristicaao { get; set; }				
		public long idanalisisorgdetalle { get; set; }				
		public int iddetallepreingreso { get; set; }				
		public string estado { get; set; }
	}
}
