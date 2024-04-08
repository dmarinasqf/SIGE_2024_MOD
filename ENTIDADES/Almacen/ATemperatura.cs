using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Temperatura", Schema = "Almacen")]
  public  class ATemperatura : AuditoriaColumna
    {
        [Key]
        public int idtemperatura { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }        
    }
}
