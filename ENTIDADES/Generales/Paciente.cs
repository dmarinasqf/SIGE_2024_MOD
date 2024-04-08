using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("PACIENTE")]
    public  class Paciente
    {
        [Key]
        [Column("cli_codigo")]
        public int idpaciente { get; set; }
        public string nombres { get; set; }
        public string apematerno { get; set; }
        public string apepaterno { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string celular { get; set; }
        public string celular2 { get; set; }     
        public string estado { get; set; }     
        public string tipopaciente { get; set; }

        public string direccion { get; set; }
        public string referencia { get; set; }
        public string numdocumento { get; set; }
        [Column("dep_codigo")]
        public int? iddepartamento { get; set; }
        [Column("dis_codigo")]
        public int? iddistrito { get; set; }
        [Column("pro_codigo")]
        public int? idprovincia { get; set; }

        public string sexo { get; set; }
        public bool? isempleado { get; set; }
        public int? idgrupo { get; set; }
        public int? iddocumento { get; set; }
        public DateTime? fechanacimiento { get; set; }

        public int? idtutor { get; set; }
        public int? idtipomascota { get; set; }
        public int? idpatologiamascota { get; set; }
        public int? idraza { get; set; }
        public int? peso { get; set; }
        public bool? pacientecannabis { get; set; }       

        [NotMapped]
        public string tutor { get; set; }
    }
}
