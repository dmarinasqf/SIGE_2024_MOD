
using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using ENTIDADES.gdp;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
    [Table("PreIngreso", Schema = "PreIngreso")]

    public class PIPreingreso:AuditoriaColumna
    {
        [Key]
        public int idpreingreso { get; set; }
        public int idordencompra { get; set; }
        public int idsucursal { get; set; }
        public int idempresa { get; set; }
        public string codigopreingreso { get; set; }
        public DateTime fecha { get; set; }
        public int idempleado { get; set; }
      
        public string quimico { get; set; }
        public string estado { get; set; }
        public int? idalmacensucursal { get; set; }
        public string obs { get; set; }
        public string observacion { get; set; }
        public bool? rechazadoporerror { get; set; }      
        public bool? controlcalidad { get; set; }      
        public int ano { get; set; }
        //public int idproveedor { get; set; }


        [ForeignKey("idalmacensucursal")]
        public AAlmacenSucursal almacensucursal { get; set; }

        [NotMapped]
        public DateTime fechadoc { get; set; }
        [NotMapped]

        public string seriedoc { get; set; }
        [NotMapped]

        public string numerodoc { get; set; }
        [NotMapped]

        public int? iddocumento { get; set; }

        [NotMapped]
        public string jsondetalle { get; set; }

        [NotMapped]
        public List<PIPreingresoDetalle> detalle { get; set; }
        [NotMapped]
        public COrdenCompra orden { get; set; }
        [NotMapped]
        public FMoneda moneda { get; set; }
        [NotMapped]
        public FCondicionPago condicionpago { get; set; }      
        [NotMapped]
        public Empresa empresa { get; set; }
        [NotMapped]
        public FDocumentoTributario documento { get; set; }
     
        [NotMapped]
        public CProveedor proveedor { get; set; }
        [NotMapped]
        public SUCURSAL sucursal { get; set; }
        [NotMapped]
        public string empleado { get; set; }

        [NotMapped]
        public int idfactura { get; set; }
        [NotMapped]
        public int idproveedor { get; set; }
    }
}
