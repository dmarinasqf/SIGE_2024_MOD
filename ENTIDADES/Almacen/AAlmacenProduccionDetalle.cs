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
    [Table("AlmacenProduccionDetalle", Schema = "Almacen")]
    public class AAlmacenProduccionDetalle
    {
        public int idmovimiento { get; set; }
        [Key]
        public int iddetalle { get; set; }
        public int idproducto { get; set; }
        public int idstock { get; set; }
        public int cantidad { get; set; }
        public string iduma { get; set; }

    }
}
