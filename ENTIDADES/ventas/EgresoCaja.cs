using ENTIDADES.finanzas;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("EGRESOS")]
   public class EgresoCaja:AuditoriaColumna
    {
        [Key]
        public int egresos_codigo { get; set; }    
        public string detallegastos { get; set; }
        public int? emp_codigo { get; set; }
        public int? suc_codigo { get; set; }
        public int? tipoegreso_codigo { get; set; }
        public int? idaperturacaja { get; set; }
        public double? monto { get; set; }
        public DateTime? fecha { get; set; }       
        public string estado { get; set; }      
        public string serie { get; set; }     
        public string numdocumento { get; set; }
        public DateTime? fechadocumento { get; set; }
        [ForeignKey("suc_codigo")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("tipoegreso_codigo")]
        public FTipoEgreso  egreso { get; set; }
        [ForeignKey("idaperturacaja")]
        public AperturarCaja   aperturacaja { get; set; }
    }
}
