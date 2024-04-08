using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.finanzas
{
    [Table("TipoTarjeta", Schema = "Finanzas")]

    public class FTipoTarjeta
    {
        [Key]
        public int idtipotarjeta { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
