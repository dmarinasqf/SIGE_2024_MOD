namespace ENTIDADES.gdp
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("OBJETIVOS_REPMED")]
    public class OBJETIVOS_REPMED
    {
        [Key]
        public int objrepm_codigo { get; set; }
        public DateTime fechaCreado { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaVence { get; set; }

        public String nombre { get; set; }
        public String descripcion { get; set; }
        public int emp_codigo { get; set; }
        public String estado { get; set; }



    }
}

