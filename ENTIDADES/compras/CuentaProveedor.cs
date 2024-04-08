using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("CuentaProveedor", Schema = "Compras")]

    public class CuentaProveedor
    {
        [Key]
        public int id { get; set; }
        public string numcuenta { get; set; }
        public string estado { get; set; }
        public int idproveedor { get; set; }
        public int? idbanco { get; set; }
        public int? idmoneda { get; set; }
        public string direccion { get; set; }
        public string swift { get; set; }
        public string aba { get; set; }
        public string iban { get; set; }
        public string beneficiary { get; set; }
        public string adreesbeneficiary { get; set; }
        public string bancointermedio { get; set; }
        public string direccionintermediario { get; set; }
        public string swiftintermediario { get; set; }
        public string cuentaintermediario { get; set; }       

        [ForeignKey("idproveedor")]
        public CProveedor proveedor { get; set; }
        [ForeignKey("idbanco")]
        public FBanco banco { get; set; }
        [ForeignKey("idmoneda")]
        public FMoneda moneda { get; set; }
    }
}
