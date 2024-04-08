using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.pedidos
{
    [Table("tipoventa")]

    public class TipoVenta
    {
        [Key]
        [Column("idtipoventa")]
        public int? idtipoventa { get; set; }
        public string descripcion { get; set; }      
       
    }
}
