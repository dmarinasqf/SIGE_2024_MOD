using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.Almacen
{
    [Table("TipoGuia", Schema = "Almacen")]
    public class ATipoGuia : AuditoriaColumna
    {
        [Key]
        public int idtipoguia { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
