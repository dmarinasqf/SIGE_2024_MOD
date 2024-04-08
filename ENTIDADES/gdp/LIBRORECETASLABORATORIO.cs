using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("LIBRORECETASLABORATORIO")]
    public class LIBRORECETASLABORATORIO
    {

        public int? lab_codigo { get; set; }
        [Key]
        public int idlibrolaboratorio { get; set; }
        public DateTime fecha { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; }
        public string estado { get; set; }
        public DateTime? fechamodificacion { get; set; }
        public int? idlibrorecetas { get; set; }

    }
}