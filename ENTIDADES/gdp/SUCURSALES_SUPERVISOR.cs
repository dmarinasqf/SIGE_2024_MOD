using ENTIDADES.Generales;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("SUCURSALES_SUPERVISOR")]
    public class SUCURSALES_SUPERVISOR
    {
        [Key]
        public int sucusuper_codigo { get; set; }
        public int suc_codigo { get; set; }
        public int emp_codigo { get; set; }

        [ForeignKey(nameof(suc_codigo))]
        public virtual SUCURSAL sucursal { get; set; }

    }
}