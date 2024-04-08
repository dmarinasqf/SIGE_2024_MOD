using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.compras
{
    [Table("RequerimientoDetalle", Schema = "Compras")]
    public class CRequerimientoDetalle : AuditoriaColumna
    {
        [Key]
        public int idrequerimientodetalle { get; set; }
        public int idrequerimiento { get; set; }
        public int idproducto { get; set; }
        public decimal cantidad { get; set; }
        public string estado { get; set; }
    }
}
