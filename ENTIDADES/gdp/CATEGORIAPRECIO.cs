namespace ENTIDADES.gdp
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("CATEGORIAPRECIO")]
    public partial class CATEGORIAPRECIO
    {
        [Key]
        public string categoriaPrecio_codigo { get; set; }

        [StringLength(50)]
        public string descripcion { get; set; }
        [StringLength(18)]
        public string estado { get; set; }
    }
}
