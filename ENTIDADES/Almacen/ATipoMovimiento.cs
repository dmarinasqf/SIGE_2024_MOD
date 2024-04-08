using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("TipoMovimiento", Schema = "Almacen")]
  public  class ATipoMovimiento : AuditoriaColumna
    {
        [Key]
        public int idtipomovimiento { get; set; }
        public string descripcion { get; set; }
        public string tipo { get; set; }        
        public string estado { get; set; }        
    }
}
