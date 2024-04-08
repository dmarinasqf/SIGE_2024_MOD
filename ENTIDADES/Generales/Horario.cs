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
    [Table("HORARIO")]
    public class Horario : AuditoriaColumna
    {
        [Key]
        public int horario_codigo { get; set; }
        public int med_codigo { get; set; }
        public int suc_codigo { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }
        public int emp_codigo { get; set; }
        public int tur_codigo { get; set; }
        public int consultorio_codigo { get; set; }
        [StringLength(30)]
        public string estado { get; set; }
        public int? nmrConsultas { get; set; }
    }
}
