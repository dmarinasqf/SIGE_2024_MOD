using ENTIDADES.finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
	[Table("Producto", Schema = "Almacen")]
	public class AProducto : AuditoriaColumna
	{
		
		[Key]
		public int idproducto { get; set; }
		public string codigoproducto { get; set; }
		public string codigodigemid { get; set; }
		public string codigodigemidgenerico { get; set; }
		public bool? iscovid { get; set; }
		public bool? isesencial { get; set; }
		public bool? isgenerico { get; set; }
		public string nombre { get; set; }
		public string nombreabreviado { get; set; }
		public string idtipoproducto { get; set; }
		public string codigobarra { get; set; }
		public string gradodistribucion { get; set; }
		public int? idlaboratorio { get; set; }
		//lromero Nov
		public string cod_cas { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? porcentajeigv { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? igv { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? vvf { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? pvf { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? porcentajeganancia { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? pvfp { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? precioxfraccion { get; set; }
		[Column(TypeName = "decimal(18, 5)")]
		public decimal? precioxblister { get; set; }
		public int? uma { get; set; }
		public int? umc { get; set; }
		public int? idequivalencia { get; set; }
		public int? multiplo { get; set; }
		public int? multiploblister { get; set; }
		public bool? proteccionluz { get; set; }
		public bool? proteccionhumedad { get; set; }
		public int? idtemperatura { get; set; }
		public int? idpresentacion { get; set; }
		public int? idclase { get; set; }
		public int? idsubclase { get; set; }
		public bool? aceptalote { get; set; }
		public bool? aceptafechavence { get; set; }
		public bool? pedirreceta { get; set; }
		public bool? mostrarventas { get; set; }
		public bool? venderblister { get; set; }
		public bool? aceptaregsanitario { get; set; }
		public bool? iscontrolado { get; set; }
		public string estado { get; set; }
        public string idtipotributo { get; set; }
        public string concentracion { get; set; }
        public string ingfarmaceutivoactivo { get; set; }
        public string cod_intuictive { get; set; }
        public int? idformafarma { get; set; }
        [ForeignKey("idformafarma")]
        public AFormaFarmaceutica formafarmaceutica { get; set; }
		[ForeignKey("idtipotributo")]
        public FTipoTributo tipotributo { get; set; }
        [NotMapped]
		public string presentacion { get; set; }
		[NotMapped]
		public string clase { get; set; }
		[NotMapped]
		public string subclase { get; set; }
		[NotMapped]
		public string unidadmedidaa { get; set; }
		[NotMapped]
		public decimal? equivalencia { get; set; }

		[NotMapped]
		public string unidadmedidac { get; set; }
		[NotMapped]
		public string laboratorio { get; set; }
		[NotMapped]
        public string regsanitario { get; set; }
		//public int? stk_min_ese { get; set; }
		public string idproductoenvase { get; set; }//EARTCOD1016

	}
}
