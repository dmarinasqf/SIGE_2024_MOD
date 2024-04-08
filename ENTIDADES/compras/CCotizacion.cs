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
    [Table("Cotizacion", Schema = "Compras")]
    public class CCotizacion:AuditoriaColumna
    {
		[Key]
		public int idcotizacion { get; set; }
		public string codigocotizacion { get; set; }
		public int? idmoneda { get; set; }
		public int? idproveedor { get; set; }
		public string estado { get; set; }		
		public int codigoempresa { get; set; }		
		public DateTime? fechasistema { get; set; }
		public DateTime? fechavencimiento { get; set; }
		public int? suc_codigo { get; set; }		 
		public int emp_codigo { get; set; }		 
		public int? idcondicionpago { get; set; }
		public int? idtipocotizacion { get; set; }
		public int? idcontacto { get; set; }
		public int? idrepresentante { get; set; }
		public int? idtipopago { get; set; }
		public int? ano { get; set; }
		public decimal cambiomoneda { get; set; }
        public string idicoterms { get; set; }
		public string observacion { get; set; }

		[ForeignKey("codigoempresa")]
        public Empresa empresa { get; set; }
		[ForeignKey("idicoterms")]
        public FIcoterms icoterms { get; set; }
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
		public SUCURSAL sucursal { get; set; }
		[NotMapped]
		public string usuario { get; set; }
		
		[NotMapped]
		public EMPLEADO empleado { get; set; }
		[NotMapped]
		public List<CCotizacionDetalle> detalle { get; set; }
		[NotMapped]
		public string _fechavencimiento { get; set; }
		[NotMapped]
		public decimal total { get; set; }
		[NotMapped]
        public string detallejson { get; set; }
		[NotMapped]
        public List<int> eliminados { get; set; }// para los items que son eliminados en el detalle

		[NotMapped]
		public int idorden { get; set; }
	}
}
