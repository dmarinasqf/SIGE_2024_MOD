namespace ENTIDADES.gdp
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("MEDICOESPECIALIDAD")]
    public class MEDICOESPECIALIDAD
    {
        public int med_codigo { get; set; }

        public int esp_codigo { get; set; }

        [Key]
        public int mede_codigo { get; set; }


    }
}
