using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ENTIDADES.Generales
{

    [Table("MEDICO")]
    public class Medico:AuditoriaColumna
    {
        [Key]
        [Column("med_codigo")]
        public int idmedico { get; set; }
        public string nombres { get; set; }
        public string apematerno { get; set; }
        public string apepaterno { get; set; }
        public string fotomedico { get; set; }
        public string fotofirma { get; set; }
        public string nrocolegiatura { get; set; }
        public string email { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }

        public int? idcolegio { get; set; }
        [Column("esp_codigo")]
        public int? idespecialidad { get; set; }
        public int? idorigen1 { get; set; }
        public int? idorigen2 { get; set; }
        public int? idorigen3 { get; set; }
        public string estado { get; set; }
        public string usuario { get; set; }
        public string clave { get; set; }

        public DateTime? fechaNacimiento { get; set; }
        public bool? asociadoQF { get; set; }
        public double? costolima { get; set; }
        public double? costoprovincia { get; set; }
        public bool? teleconsulta { get; set; }
        public decimal? costoteleconsulta { get; set; }
        public bool? convenio { get; set; }
        public bool? checktercero { get; set; }
        public bool? checkms { get; set; }
        public decimal? comisionfm1 { get; set; }
        public decimal? comisionfm2 { get; set; }
        public decimal? comisionpt1 { get; set; }
        public decimal? comisionprocedimiento { get; set; }
        public int? iddepartamento { get; set; }
        public int? idprovincia { get; set; }
        public int? iddistrito { get; set; }
        public string direccionconsultorio { get; set; }
        public string especializado { get; set; }
        public string observacion { get; set; }
        public bool checkcomisionfm { get; set; }
        public bool checkcomisionpt { get; set; }
        public int frecuencia { get; set; }
        public string categoria { get; set; }
        public int IdLineaAtencion { get; set; }
        //zoom
        public string zoomapikey { get; set; }
        public string zoomapisecret { get; set; }
        public string usuariozoom { get; set; }
        public string clavezoom { get; set; }

        [NotMapped]
        public bool? conocecannabis { get; set; }
        [NotMapped]
        public bool? conoceformulacion { get; set; }
        [NotMapped]
        public bool? conocimientofm { get; set; }

        [NotMapped]
        public int? costoconsultapresencial { get; set; }
        [NotMapped]
        public int? consultapresencial { get; set; }
        [NotMapped]
        public string nombreorigen1 { get; set; }
        [NotMapped]
        public string nombreorigen2 { get; set; }
        [NotMapped]
        public string nombreorigen3 { get; set; }
        [NotMapped]
        public string especialidad { get; set; }
        [NotMapped]
        public string colegio { get; set; }
    }
}
