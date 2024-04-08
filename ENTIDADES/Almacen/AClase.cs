using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Clase",Schema = "Almacen")]
  public  class AClase:AuditoriaColumna
    {
        [Key]
        public int idclase { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }        
    }
}
