using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("TIPO_EMPRESA")]
    public class TIPO_EMPRESA
    {
        [Key]
        [StringLength(50)]
        public string tipoem_codigo { get; set; }
        [StringLength(50)]

        public string descripcion { get; set; }
    }
}