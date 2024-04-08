using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("Venta", Schema = "Ventas")]
    public class Venta:AuditoriaColumna
    {
        [Key]
        public long idventa { get; set; }
        public int idempleado { get; set; }
        public int iddocumento { get; set; }
        public int idsucursal { get; set; }
        public int idempresa { get; set; }
      
        public int idaperturacaja { get; set; }        
        public int? idcliente { get; set; }
        public int? idpaciente { get; set; }
        public bool? txtgenerado { get; set; }
        public DateTime? fecha { get; set; }
        public string estado { get; set; }
        public string serie { get; set; }
        public string numdocumento { get; set; }

        public string usuarioanula { get; set; }
        public DateTime? fechaanulacion { get; set; }
        public string anuladopor { get; set; }
        public decimal? subtotal { get; set; }
        public decimal? total { get; set; }
        public string textomoneda { get; set; }
        public string ventapor { get; set; }
        public long? idtablaventapor { get; set; }
        public bool? ismanual { get; set; }
        public int? med_codigo { get; set; }
        public decimal? pkdescuento { get; set; }//EARTCOD1009
        //public int? idpromopack { get; set; }//EARTCOD1009
        

        [NotMapped]
        public string jsondetalle { get; set; }
        [NotMapped]
        public string jsonpagos { get; set; }
        [NotMapped]
        public string idguiasSalidas { get; set; }
        [NotMapped]
        public int idcorrelativo { get; set; }
        [NotMapped]
        public DateTime fechatraslado { get; set; }
        [NotMapped]
        public decimal peso { get; set; }
        [NotMapped]
        public decimal bulto { get; set; }
        [NotMapped]
        public int idcajasucursal { get; set; }

        [ForeignKey("idempleado")]
        public EMPLEADO empleado { get; set; }
        [ForeignKey("iddocumento")]
        public FDocumentoTributario documentotributario { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idempresa")]
        public Empresa empresa { get; set; }
        [ForeignKey("idaperturacaja")]
        public AperturarCaja caja { get; set; }  
       
       
        [ForeignKey("idcliente")]
        public Cliente cliente { get; set; }
       
    }

    //Cargar Ventas desde Txt's de Horizont
    public class CabeceraTxt
    {
        public string serie { get; set; }
        public string numdocumento { get; set; }
        public string fecha { get; set; }
        public string idempresa { get; set; }
        public string idsucursal { get; set; }
        public string tipoDocumento { get; set; }
        public string idcliente { get; set; }
        public string nombrecliente { get; set; }
        public string total { get; set; }
        public string textomoneda { get; set; }
        public string jsonDetalle { get; set; }
        public int cantidadDetalle { get; set; }
    }

    public class DetalleTxt
    {
        public string idproducto { get; set; }
        public string cantidad { get; set; }
        public string precioconigv { get; set; }
        public string preciosinigv { get; set; }
        public string isfraccion { get; set; }
        public string idstock { get; set; }
        public string idprecioproducto { get; set; }
    }
}
