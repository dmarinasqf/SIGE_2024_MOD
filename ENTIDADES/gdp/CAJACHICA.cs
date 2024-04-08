using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("CAJACHICA")]
    public class CAJACHICA
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int suc_codigo { get; set; }
        public double? montodisponible { get; set; }

    }
}