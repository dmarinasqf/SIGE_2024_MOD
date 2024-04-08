namespace ENTIDADES.gdp
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("USUARIO")]
    public class USUARIO
    {

        [Key]
        public int emp_codigo { get; set; }

        [StringLength(18)]
        public string usuario_name { get; set; }

        [StringLength(18)]
        public string clave { get; set; }



    }
}
