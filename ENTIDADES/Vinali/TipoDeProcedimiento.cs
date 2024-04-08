using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Vinali
{
    [Table("TIPODEPROCEDIMIENTO")]

    public class TipoDeProcedimiento
    {
        [Key]
        public int tipodeproc_codido { get; set; }
        public string descripcion { get; set; }
        public double? costo { get; set; }
        public string codigo { get; set; }
        public string estado { get; set; }
        public int? suc_codigo { get; set; }
        public DateTime? fechacreacion { get; set; }
        public DateTime? fechaedicion { get; set; }
    }
}
