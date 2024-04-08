using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    [Table("OrigenReceta")]

    public class OrigenReceta:AuditoriaColumna
    {
        [Key]
        [Column("origenreceta_codigo")]
        public int idorigenreceta { get; set; }      
        public string direccion { get; set; }
        public string estado { get; set; }
        [Column("dep_codigo")]
        public int? iddepartamento { get; set; }
        [Column("pro_codigo")]
        public int? idprovincia { get; set; }
        [Column("dis_codigo")]
        public int? iddistrito { get; set; }
        [Column("tipoorigen_codigo")]
        public int? idtiporigen { get; set; }     
        public string descripcion { get; set; }
    }
}
