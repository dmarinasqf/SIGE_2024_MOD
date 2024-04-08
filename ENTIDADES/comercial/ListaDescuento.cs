using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("ListaDescuento", Schema = "Comercial")]
    public class ListaDescuento
    {
        [Key]
        public int id { get; set; }
        public int idlista { get; set; }
        public int iddetalle { get; set; }
        public decimal? pventa { get; set; }
        public decimal? dessucursal { get; set; }
        public decimal? desproveedor { get; set; }
        public string tipodescuento { get; set; }

    }
}
