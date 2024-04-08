using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Generales
{
    [Table("MedicoBanco")]
    public class MedicoBanco : AuditoriaColumna
    {
        [Key]
        public int iddetalle { get; set; }
        public int idmedico { get; set; }
        public int idbanco { get; set; }
        public string cuenta { get; set; }
        public string estado { get; set; }
        public string cci { get; set; }
    }
}
