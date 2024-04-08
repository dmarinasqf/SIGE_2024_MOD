using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.visitadormedico
{
    [Table("HORARIO_VISITA_MEDICOS")]
    public class HorarioVisitaMedica
    {
        [Key]
        public int hvm_codigo { get; set; }
        public DateTime horaInicio { get; set; }
        public DateTime horaFin { get; set; }
        public int med_codigo { get; set; }
        public int emp_codigo { get; set; }
        public string estado { get; set; }
        public int tur_codigo { get; set; }
        public int objrepm_codigo { get; set; }
        public int? iddiagnostico { get; set; }
        public bool? visita { get; set; }
        public string descripcion { get; set; }
        public string estadovisita { get; set; }
        public string detallenovisita { get; set; }
        public string usuarioCreo { get; set; }
        public DateTime fechaCreado { get; set; }
        public string usuarioModifica { get; set; }
        public DateTime fechaModificacion { get; set; }
        public string tipovisita { get; set; }
        public string mediovisita { get; set; }
        public string observacion { get; set; }


        [NotMapped]
        public bool condicionregistro { get; set; }
    }
}
