using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("AlmacenSucursal", Schema = "Almacen")]
    public class AAlmacenSucursal : AuditoriaColumna
    {
        [Key]
		public int idalmacensucursal { get; set; }
		public int? idalmacen { get; set; }		
		public int? idareaalmacen { get; set; }
		public int? suc_codigo { get; set; }
		public string estado { get; set; }		

		[NotMapped]
		public string almacen { get; set; }
		[NotMapped]
		public string areaalmacen { get; set; }
		[NotMapped]
		public int estadoalmacen { get; set; }
		[NotMapped]
		public string sucursal { get; set; }

	}
}
