using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("Banco", Schema = "Finanzas")]

     public class FBanco:AuditoriaColumna
    {
        [Key]
        public int idbanco { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
        public string ubicacion { get; set; }
    }

}
