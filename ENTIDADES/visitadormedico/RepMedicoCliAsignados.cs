using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.visitadormedico
{
    [Table("REPMEDICO_CLI_ASIGNADOS")]
    public class RepMedicoCliAsignados
    {
        [Key]
        [Column("rca_codigo")]
        public int idrca { get; set; }
        [Column("cliTercero_codigo")]
        public int idcliente { get; set; }
        [Column("emp_codigo")]
        public int idrepresentante { get; set; }
        public string idcanalventa { get; set; }
        public String estado { get; set; }
    }
}
