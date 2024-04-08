using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("ProductoParecido", Schema = "Almacen")]
    public class AProductoParecido : AuditoriaColumna
    {
        [Key]
        public int idproductoproductoparecido { get; set; }
        public int idproducto { get; set; }
        public int idproductoparecido { get; set; }
        public string estado { get; set; }
    }
}
