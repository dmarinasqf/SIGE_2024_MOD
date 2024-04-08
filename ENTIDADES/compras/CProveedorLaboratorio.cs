using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("ProveedorLaboratorio", Schema = "Compras")]
    public class CProveedorLaboratorio : AuditoriaColumna
    {
        [Key]
		public int idproveedorlab { get; set; }
		public int idlaboratorio { get; set; }
		public int idproveedor { get; set; }
		public string estado { get; set; }

		[NotMapped]
		public string laboratorio { get; set; }
		[NotMapped]
		public string proveedor { get; set; }

		

	}
}
