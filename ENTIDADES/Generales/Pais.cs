using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("Pais")]
    public class Pais:AuditoriaColumna
    {
		[Key]
		public int idpais { get; set; }
		public string nombre { get; set; }
		public string estado { get; set; }				
	}
}
