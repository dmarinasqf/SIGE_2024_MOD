using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
	[Table("CaracteristicaAO", Schema = "PreIngreso")]
	public class PICaracteristicaAO : AuditoriaColumna
    {
		[Key]
		public int idcaracteristicaao { get; set; }
		public int idcategoriaao { get; set; }				
		public string descripcion { get; set; }				
		public string nombreabreviado { get; set; }					
		public string estado { get; set; }
		[NotMapped]
		public string categoriaao { get; set; }
		//[ForeignKey]
	}
}
