using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("Cuenta", Schema = "Finanzas")]

    public class FCuenta:AuditoriaColumna
    {
        [Key]
        public int idcuenta { get; set; }
        public int? idbanco { get; set; }
        public string descripcion { get; set; }
        public string numcuenta { get; set; }
        public string estado { get; set; }
       
        [ForeignKey("idbanco")]
        public FBanco banco { get; set; }
    }
}
