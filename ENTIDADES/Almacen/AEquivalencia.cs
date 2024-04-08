using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Equivalencia", Schema = "Almacen")]
   public class AEquivalencia : AuditoriaColumna
    {
        [Key]
		public int idequivalencia { get; set; }
		public int? unidadmedidainicial { get; set; }
		public int? unidadmedidafinal { get; set; }
		public decimal equivalencia { get; set; }
		public string estado { get; set; }

		[NotMapped]
		public string unidadmedidai { get; set; }
		[NotMapped]
		public string unidadmedidaf { get; set; }
	}
}
