using ENTIDADES.Generales;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("SUCURSALES_REPMEDICO")]
    public class SUCURSALES_REPMEDICO
    {
        [Key]
        public int sucurep_codigo { get; set; }
        public int suc_codigo { get; set; }
        public int emp_codigo { get; set; }

        [ForeignKey(nameof(suc_codigo))]
        public virtual SUCURSAL sucursal { get; set; }
    }
}