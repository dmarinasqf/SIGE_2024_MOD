using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("DETALLECAJACHICA")]
    public class DETALLECAJACHICA
    {
        [Key]
        public int idcajachica { get; set; }

        public int suc_codigo { get; set; }
        public double? monto { get; set; }
        public DateTime? fecha { get; set; }
        public string noperacion { get; set; }
        public string estado { get; set; }
        public int? emp_codigo { get; set; }
        public DateTime? fechacreacion { get; set; }
        public DateTime? fechaedicion { get; set; }
        public int? usuariocreo { get; set; }
        public int? usuariomodifica { get; set; }


    }
}