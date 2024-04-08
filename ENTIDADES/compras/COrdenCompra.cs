using ENTIDADES.Almacen;
using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using ENTIDADES.gdp;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("OrdenCompra", Schema = "Compras")]
   public  class COrdenCompra:AuditoriaColumna
    {
		[Key]
		public int idordencompra { get; set; }
		public string codigoorden { get; set; }
		public int? idmoneda { get; set; }
		public int? idproveedor { get; set; }
		public string estado { get; set; }
		public int idempresa { get; set; }
		public DateTime? fecha { get; set; }
		public DateTime? fechaaprobacion { get; set; }
		public DateTime? fechavencimiento { get; set; }
		public DateTime? fechautilizacion { get; set; }
		public int emp_codigo { get; set; }
		public int? usuarioaprueba { get; set; }
		public int? idcondicionpago { get; set; }
		public int? idcontacto { get; set; }
		public int? idtipopago { get; set; }
		public int? ano { get; set; }
		public int? idrepresentante { get; set; }
		public int idsucursaldestino { get; set; }
		public int idsucursal { get; set; }
		public decimal? cambiomoneda { get; set; }
		public decimal? percepcion { get; set; }
		public string idicoterms { get; set; }
		public string observacion { get; set; }
		[ForeignKey("idicoterms")]
		public FIcoterms icoterms { get; set; }

		[NotMapped]
        public bool? ispercepcion { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
        [NotMapped]
		public CProveedor proveedor { get; set; }
		[NotMapped]
		public CContactosProveedor contacto { get; set; }
		[NotMapped]
		public CRepresentanteLaboratorio representante { get; set; }
		[NotMapped]
		public FMoneda moneda { get; set; }
		[NotMapped]
		public FCondicionPago condicionpago { get; set; }
		[NotMapped]
		public FTipoPago tipopago { get; set; }
		[NotMapped]
		public Empresa empresa { get; set; }
		
		[NotMapped]
		public string usuario { get; set; }
		[NotMapped]
		public EMPLEADO empleado { get; set; }	
		[NotMapped]
		public List<COrdenDetalle> detalle { get; set; }
		[NotMapped]
		public string _fechavencimiento { get; set; }
		[NotMapped]
		public decimal total { get; set; }	
		[NotMapped]
		public string sucursaldestino { get; set; }
	}
}
