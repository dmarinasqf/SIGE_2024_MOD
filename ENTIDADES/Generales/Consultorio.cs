using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Generales
{
    using ENTIDADES.Generales;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("CONSULTORIO")]
    public class Consultorio
    {
        [Key]
        public int consultorio_codigo { get; set; }
        [StringLength(15)]
        public string descripcion { get; set; }
        public int suc_codigo { get; set; }
        [StringLength(15)]
        public string estado { get; set; }

        [ForeignKey(nameof(suc_codigo))]
        public virtual SUCURSAL sucursal { get; set; }
    }
}
