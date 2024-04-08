using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{

    [Table("TipoCotizacion", Schema = "Compras")]
    public class CTipoCotizacion
    {
        [Key]
        public int idtipocotizacion { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
    }
}
