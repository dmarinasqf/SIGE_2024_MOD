using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("AnalisisOrgDetalle", Schema = "PreIngreso")]
	public class PIAnalisisOrgDetalle : AuditoriaColumna
    {
		[Key]
		public long idanalisisorgdetalle { get; set; }
		public long idanalisisorganoleptico { get; set; }
		public int iddetallepreingreso { get; set; }		
		public int idproducto { get; set; }
		public long idstock { get; set; }
		public int cantidadmuestra { get; set; }
		public int cantidadaprobada { get; set; }
		public int cantidadrechazada { get; set; }
		public string resultado { get; set; }
		public DateTime? fecha { get; set; }
        public int? idlote { get; set; }
        public string observacion { get; set; }
		public string estado { get; set; }

		[NotMapped]
        public string detallecaracteristicajson { get; set; }
    }
}
