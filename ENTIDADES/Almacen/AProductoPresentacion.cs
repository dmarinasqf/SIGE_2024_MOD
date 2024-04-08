using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("ProductoPresentacion", Schema = "Almacen")]
    public class AProductoPresentacion:AuditoriaColumna
    {
        [Key]
        public int idpresentacion { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
