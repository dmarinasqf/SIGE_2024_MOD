using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("Recepcion", Schema = "PreIngreso")]
	public class PIRecepcion: AuditoriaColumna
    {
		[Key]
		public int idrecepcion { get; set; }
		public int? iddetallecontrol { get; set; }
		public bool? noabierto { get; set; }
		public bool? limpio { get; set; }
		public bool? noarrugado { get; set; }
		public bool? noquebrado { get; set; }
		public string temperaturaalmacen { get; set; }
		public bool? usuariorecibe { get; set; }
		public string resultado { get; set; }
		public string observacion { get; set; }
		
	}
}
