using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.preingreso
{
    [Table("DetalleBonificacionFueraDocumento", Schema = "PreIngreso")]

    public class PIDetalleBonificacionFueraDocumento:AuditoriaColumna
    {
        [Key]
        public int id { get; set; }
        public int idfactura { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }
        public int? idproducto { get; set; }
        public int cantidadingresada { get; set; }
        public int cantidadoc { get; set; }
        public string lote { get; set; }
        public string regsanitario { get; set; }
        public string promocion { get; set; }
        public DateTime? fechavencimiento { get; set; }
        public int? idcotizacionbonfi { get; set; }
        public int? iddetallepreingreso { get; set; }


        [ForeignKey("iddetallepreingreso")]
        public PIPreingresoDetalle detallepreingreso { get; set; }
        [ForeignKey("idfactura")]
        public PIFacturaPreingreso facturapreingreso { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
    }
}
