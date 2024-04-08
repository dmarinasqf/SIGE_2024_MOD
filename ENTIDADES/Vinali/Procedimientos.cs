using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Vinali
{

    [Table("PROCEDIMIENTO")]
    public class Procedimientos
    {
        [Key]
        public int procedimiento_codigo { get; set; }
        public DateTime? fecha { get; set; }       
        public string numDocumento { get; set; }
        public int? cli_codigo { get; set; }
        public int? suc_codigo { get; set; }
        public int? med_codigo { get; set; }      
        public string estado { get; set; }
        public string observacion { get; set; }
        public string usuariocrea { get; set; }
        public DateTime? fechacreacion { get; set; }
        [NotMapped]
        public string nombremedico { get; set; }

        [NotMapped]
        public string nombrecliente { get; set; }

        [NotMapped]
        public string nombresucursal { get; set; }
        [NotMapped]
        public double total { get; set; }
    }
}
