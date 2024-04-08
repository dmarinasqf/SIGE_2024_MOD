using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.ventas
{
    [Table("CanalVenta", Schema = "Ventas")]

    public class CanalVenta
    {
        [Key]
        public string idcanalventa { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
