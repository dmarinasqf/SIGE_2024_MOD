using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("UnidadMedida", Schema = "Almacen")]
   public class AUnidadMedida : AuditoriaColumna
    {
        [Key]
		public int idunidadmedida { get; set; }
		public string abreviatura { get; set; }		
		public string descripcion { get; set; }		
		public string estado { get; set; }
	}
}
