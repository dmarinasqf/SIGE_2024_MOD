using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.finanzas
{
    [Table("TIPO_EGRESO")]
   public  class FTipoEgreso
    {
        [Key]
        public int tipoegreso_codigo { get; set; }
        public string descripcion { get; set; }
        public string asiento { get; set; }
        public string estado { get; set; }
    }
}
