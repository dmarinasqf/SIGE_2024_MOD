using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("AccionFarmacologica", Schema = "Almacen")]
  public  class AAccionFarmacologica : AuditoriaColumna
    {
        [Key]
        public int idaccionfarma { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }        
    }
}
