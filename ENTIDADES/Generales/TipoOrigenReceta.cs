using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    [Table("TIPO_ORIGEN")]
  public  class TipoOrigenReceta
    {
        [Key]
        [Column("tipoorigen_codigo")]
        public int idtipo { get; set; }
     
        public string descripcion { get; set; }
    }
}
