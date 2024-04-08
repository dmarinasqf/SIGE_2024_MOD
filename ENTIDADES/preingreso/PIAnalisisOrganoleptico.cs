using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("AnalisisOrganoleptico", Schema = "PreIngreso")]
	public class PIAnalisisOrganoleptico : AuditoriaColumna
    {
		[Key]
		public long idanalisisorganoleptico { get; set; }
		public string codigoanalisisorganoleptico { get; set; }
		public int idsucursal { get; set; }
		public int idempresa { get; set; }
		public int idpreingreso { get; set; }
		public int idfactura { get; set; }
		public int idquimico { get; set; }
		public DateTime fecha { get; set; }		
		public string observacion { get; set; }
		public string estado { get; set; }
		[NotMapped]
		public EMPLEADO quimico { get; set; }
		[NotMapped]
		public string jsondetalle { get; set; }
		[NotMapped]
		public Empresa empresa { get; set; }
		[NotMapped]
		public SUCURSAL sucursal { get; set; }
	}
}
