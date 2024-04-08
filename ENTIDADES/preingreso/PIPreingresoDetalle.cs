using ENTIDADES.Almacen;
using ENTIDADES.compras;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.preingreso
{
    [Table("DetallePreIngreso", Schema = "Preingreso")]
    public class PIPreingresoDetalle:AuditoriaColumna
    {      
        public int idpreingreso { get; set; }
        [Key]
        public int iddetallepreingreso { get; set; }
        public int idproducto { get; set; }
        public int? cantoc { get; set; }
        public int? cantfactura { get; set; }
        public int? cantingresada { get; set; }
        
        public int? cantdevuelta { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
        public int? idfactura { get; set; }


        public int? iddetalle { get; set; }
        public string tabla { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? costo { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? costoigv { get; set; }
        public int? idcotizacionbonfi { get; set; }
        public string ordenItemsAprobarFactura { get; set; }
        [ForeignKey("idfactura")]
        public PIFacturaPreingreso factura { get; set; }

        [NotMapped]
        public PILote[] lotes { get; set; }
        [NotMapped]
        public List<PICondicionEmbalaje> embalaje { get; set; }
        [NotMapped]
        public AProducto producto { get; set; } 
        [NotMapped]
        public CProductoProveedor productopro { get; set; }
        [NotMapped]
        public string laboratorio { get; set; } 
        [NotMapped]
        public int idproductopro { get; set; }
        [NotMapped]
        public string uma { get; set; }
        [NotMapped]
        public string ump { get; set; } 
        [NotMapped]
        public decimal equivalencia { get; set; }
        [NotMapped]
        public int iddetallecotizacionbonificacion { get; set; }
    }
}
