using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("ProductoProveedor", Schema = "Compras")]
    public class CProductoProveedor:AuditoriaColumna
    {
        public int idproveedor { get; set; }
        [Key]
        public int idproductoproveedor { get; set; }
        public int? idproducto { get; set; }     
        public string descripcion { get; set; }
        public string codproductoproveedor { get; set; }
        public string estado { get; set; }
        [NotMapped]
        public AProducto producto { get; set; }       
        [NotMapped]
        public CProveedor proveedor  { get; set; }
        [NotMapped]
        public decimal equivalencia { get; set; }
    }
}
