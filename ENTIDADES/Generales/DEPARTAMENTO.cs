namespace ENTIDADES.Generales
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("DEPARTAMENTO")]
    public partial class DEPARTAMENTO
    {


        [Key]
        public int dep_codigo { get; set; }

        [StringLength(100)]
        public string descripcion { get; set; }
        public string estado { get; set; }


    }
}
