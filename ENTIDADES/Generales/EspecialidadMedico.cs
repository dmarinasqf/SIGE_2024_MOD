using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("ESPECIALIDAD")]
    public class EspecialidadMedico:AuditoriaColumna
    {
        [Key]
        public int esp_codigo { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public int idcolegio { get; set; }
    }
}
