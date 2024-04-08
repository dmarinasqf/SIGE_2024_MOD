namespace ENTIDADES.gdp
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("TURNO")]
    public class TURNO
    {


        [Key]
        public int tur_codigo { get; set; }
        [MaxLength(50)]
        public string descripcion { get; set; }


    }
}
