using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("CategoriaAO", Schema = "PreIngreso")]
	public class PICategoriaAO : AuditoriaColumna
    {
		[Key]
		public int idcategoriaao { get; set; }			
		public string descripcion { get; set; }
		public string estado { get; set; }
	}
}
