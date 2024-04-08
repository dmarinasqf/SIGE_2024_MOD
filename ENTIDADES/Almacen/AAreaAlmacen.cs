using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("AreaAlmacen", Schema = "Almacen")]
   public class AAreaAlmacen: AuditoriaColumna
    {
        [Key]
		public int idareaalmacen { get; set; }
		public string descripcion { get; set; }
		//public int? suc_codigo { get; set; }
		public string estado { get; set; }

		//[NotMapped]
		//public string sucursal { get; set; }

		//[ForeignKey(nameof(suc_codigo))]
		//public virtual SUCURSAL sucursal { get; set; }


	}
}
