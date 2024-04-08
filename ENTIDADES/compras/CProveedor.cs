using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("Proveedor", Schema = "Compras")]
    public class CProveedor:AuditoriaColumna
    {
		[Key]
		public int idproveedor { get; set; }
		public string razonsocial { get; set; }
		public string nombrecomercial { get; set; }
		public string ruc { get; set; }
		public string telefonod { get; set; }
		public string direcciond { get; set; }
		public string ubicacion { get; set; }
		public string ctaproveedor { get; set; }		
		public string situacion { get; set; }		
		public int? idpais { get; set; }
		public int? iddepartamento { get; set; }
		public int? idprovincia { get; set; }
		public int? iddistrito { get; set; }
		public int? idmoneda { get; set; }
		public int? idbanco { get; set; }
		public int? idcondicionpago { get; set; }
		public string estado { get; set; }
		public string email { get; set; }
		public string observaciones { get; set; }
		public string habido { get; set; }
		//lromero Nov
		public string idtipoproducto { get; set; }
		public decimal? des1 { get; set; }
		[NotMapped]
		public FMoneda moneda { get; set; }
		[NotMapped]
		public CContactosProveedor contacto { get; set; }
		[NotMapped]
		public CRepresentanteLaboratorio representante { get; set; }
		[NotMapped]
		public string producto { get; set; }
		[NotMapped]
        public string banco { get; set; }
    }
}
