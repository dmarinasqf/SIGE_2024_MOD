using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Laboratorio", Schema = "Almacen")]
    public class ALaboratorio:AuditoriaColumna
    {
        [Key]
        public int idlaboratorio { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
