using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("LISTAPRECIOSUCURSAL")]
    public class LISTAPRECIOSUCURSAL
    {

        [Key]
        public int listasucursal_codigo { get; set; }
        [MaxLength(50)]
        public string categoriaprecio_codigo { get; set; }
        [MaxLength(18)]
        public string estado { get; set; }
        public int suc_codigo { get; set; }


        [NotMapped]
        public string categoriadescripcion { get; set; }
        [NotMapped]
        public string sucursal { get; set; }

    }
}