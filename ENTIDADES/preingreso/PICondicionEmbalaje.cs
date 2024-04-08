using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.preingreso
{
    [Table("CondicionEmbalaje", Schema = "PreIngreso")]

    public class PICondicionEmbalaje
    {
        [Key]
        public int iddetalle { get; set; }
        public string iditem { get; set; }
        public int iddetallepreingreso { get; set; }
        public string valor { get; set; }
        public string estado { get; set; }
        [ForeignKey("iditem")]
        public PIItemCondicionEmbalaje itemembalaje { get; set; }
        [ForeignKey("iddetallepreingreso")]
        public PIPreingresoDetalle detallepreingreso { get; set; }
    }
}
