using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES;

namespace ENTIDADES.Almacen
{
    [Table("ConsumoEconomatoDetalle", Schema = "Almacen")]
    public class AConsumoEconomatoDetalle : AuditoriaColumna
    {
        [Key]
        public int idconsumoeconomatodetalle { get; set; }
        public int idconsumoeconomato { get; set; }
        public int idproducto { get; set; }
        public int idstock { get; set; }
        public int cantidad { get; set; }
        public string estado { get; set; }
    }
}
