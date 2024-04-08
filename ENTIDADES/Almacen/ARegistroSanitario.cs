using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("RegistroSanitario", Schema = "Almacen")]
    public class ARegistroSanitario:AuditoriaColumna
    {
        [Key]
        public int id { get; set; }
        public int idproducto { get; set; }
        public string estado { get; set; }
        public string registro { get; set; }
        public DateTime? fechainicio { get; set; }
        public DateTime? fechafin { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
    }
}
