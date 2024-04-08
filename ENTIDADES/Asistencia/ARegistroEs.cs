using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Asistencia
{
    [Table("RegistroES", Schema = "asistencia")]
    public class ARegistroEs 
    {
        [Key]
        public int idAsistencia { get; set; }
        public DateTime? fechaIngreso { get; set; }
        public DateTime? fechaIAlmuerzo { get; set; }
        public DateTime? fechaFAlmuerzo { get; set; }
        public DateTime? fechaSalidaEmergencia { get; set; }
        public DateTime? fechaSalida { get; set; }
        public DateTime? fechaIHoraExtra { get; set; }
        public DateTime? fechaFHoraExtra { get; set; }
        public int totalHorTrabajadas { get; set; }
        public string  fecha { get; set; }
        public string documento { get; set; }
        public int idEmpleadoA_JE { get; set; }
        public string justificacionE { get; set; }
        public int idEmpleadoA_JEH { get; set; }
        public string justificacionHE { get; set; }
        public int usuarioModifica { get; set; }
        public DateTime? fechaModificado { get; set; }   
        public int idempleadoR { get; set; }
        public decimal temperatura { get; set; }
        public string observacion { get; set; }
        public decimal temperaturaf { get; set; }
        public string observacionf { get; set; }
    }
}
