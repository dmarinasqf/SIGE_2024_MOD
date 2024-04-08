using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.visitadormedico
{
    [Table("OBJETIVOS_REPMED")]
    public class ObjetivoRepMedico:AuditoriaColumna
    {
        [Key]
        [Column("objrepm_codigo")]
        public int idobjetivo { get; set; }        
        public DateTime fechainicio { get; set; }
        public DateTime fechavence { get; set; }
        public String nombre { get; set; }
        public String descripcion { get; set; }        
        public String estado { get; set; }
    }
}
