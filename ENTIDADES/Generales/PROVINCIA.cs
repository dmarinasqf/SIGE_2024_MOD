namespace ENTIDADES.Generales
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("PROVINCIA")]
    public class PROVINCIA
    {
        

        public int? dep_codigo { get; set; }

        [Key]
        public int pro_codigo { get; set; }

        [StringLength(100)]
        public string descripcion { get; set; }
        public string estado { get; set; }


    }
}
