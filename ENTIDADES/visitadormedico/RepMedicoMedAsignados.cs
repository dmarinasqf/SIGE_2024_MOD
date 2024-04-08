using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.visitadormedico
{
    [Table("REPMEDICO_MED_ASIGNADOS")]

    public class RepMedicoMedAsignados
    {
        [Key]
        [Column("rma_codigo")]
        public int iddetalle { get; set; }
        [Column("med_codigo")]
        public int idmedico { get; set; }
        [Column("emp_codigo")]
        public int idrepresentante { get; set; }
        public string idcanalventa { get; set; }
        public String estado { get; set; }
    }
  
}
