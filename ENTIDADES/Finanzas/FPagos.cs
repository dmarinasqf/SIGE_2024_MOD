using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("Pagos", Schema = "Finanzas")]

  public  class FPagos:AuditoriaColumna
    {
        [Key]
        public int idpago { get; set; }
        public int? idsucursal { get; set; }
        public int? idcuenta { get; set; }
        public int? idtipopago { get; set; }
        public int? idtabla { get; set; }
        public int? idempresa { get; set; }
        public string tabla { get; set; }
        public string estado { get; set; }
        public string numoperacion { get; set; }
        public DateTime? fecha { get; set; }
        public decimal? monto { get; set; }
        public string imagen { get; set; }
        public string usuarioaprueba { get; set; }
        public string observacion { get; set; }
        public bool? validado { get; set; }
        public bool? isinterbancario { get; set; }
        public DateTime? fechaaprobacion { get; set; }
        //[ForeignKey("idbanco")]
        //public FBanco banco { get; set; }
        //[ForeignKey("idsucursal")]
        //public SUCURSAL sucursal { get; set; }
        [ForeignKey("idcuenta")]
        public FCuenta cuenta { get; set; }
        //[ForeignKey("idtipopago")]
        //public FTipoPago tipopago { get; set; }
        //[ForeignKey("idempresa")]
        //public Empresa empresa { get; set; }

    }
}
