using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("PreciosProducto", Schema = "Comercial")]
    public class PreciosProducto:AuditoriaColumna
    {
        [Key]
        public long idprecioproducto { get; set; }
        public int idproducto { get; set; }
        public int idlistaprecio { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? precio { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? precioxfraccion { get; set; }
        [Column(TypeName = "decimal(18, 5)")]
        public decimal? precioxblister { get; set; }
        public decimal? descuento { get; set; }
        public decimal? incentivo { get; set; }
        public decimal? incentivoxfraccion { get; set; }
        public string estado { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; } 
        [ForeignKey("idlistaprecio")]
        public ListaPrecios listaprecios { get; set; }
        [NotMapped]
        public string codigoproducto { get; set; }
        [NotMapped]
        public bool agregareditar { get; set; }
        public decimal? precioSindescuento { get; set; }
        public decimal? cantidadDescuento { get; set; }
        public decimal? porcentajedescuento { get; set; }


    }
}
