using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("DescuentoCobrar", Schema = "Comercial")]

    public class DescuentoCobrar
    {
        [Key]
        public int iddescuentocobrar { get; set; }
        public int iddescuentolista { get; set; }
        public decimal? cantidad { get; set; }
        public decimal? precio { get; set; }
        public decimal? preciocompra { get; set; }
        public decimal? descuento { get; set; }
        public decimal? importepagar { get; set; }
        public int iddetalle { get; set; }
        public string    tabla { get; set; }
        public string    estado { get; set; }
        public string    tipo { get; set; }
    }
}
