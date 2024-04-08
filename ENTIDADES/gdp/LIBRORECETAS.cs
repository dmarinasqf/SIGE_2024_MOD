using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("LIBRORECETAS")]

    public class LIBRORECETAS
    {
        public int? detp_codigo { get; set; }
        public int? suc_codigo { get; set; }
        [Key]
        public int idlibrorecetas { get; set; }
        public DateTime fecha { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; }
        public string estado { get; set; }
        public int? orden { get; set; }
        public int? cliTercero_codigo { get; set; }
        public string registro { get; set; }
        public int? idlaboratorio { get; set; }
    }
}