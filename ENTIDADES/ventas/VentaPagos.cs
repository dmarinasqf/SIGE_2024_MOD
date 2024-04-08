using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("VentaPagos", Schema = "Ventas")]
   public class VentaPagos:AuditoriaColumna
    {
        [Key]
        public int idpago { get; set; }
        public long idventa { get; set; }
        public int? idtipopago { get; set; }
        public int? idtipotarjeta { get; set; }
        public int? idmoneda { get; set; }
        public decimal? subtotal { get; set; }
        public decimal? total { get; set; }
        //public decimal? totalredondeado { get; set; }
        public decimal? cambiomoneda { get; set; }
        public decimal? montopagado { get; set; }
        public decimal? montosaldo { get; set; }
        public decimal? montodevuelto { get; set; }      
        public string estado { get; set; }
        public string numtarjeta { get; set; }

        [ForeignKey("idmoneda")]
        public FMoneda moneda { get; set; }
        [ForeignKey("idventa")]
        public Venta venta { get; set; }
        [ForeignKey("idtipopago")]
        public FTipoPago tipopago { get; set; }
        [ForeignKey("idtipotarjeta")]
        public FTipoTarjeta tipotarjeta { get; set; }
    }
}
