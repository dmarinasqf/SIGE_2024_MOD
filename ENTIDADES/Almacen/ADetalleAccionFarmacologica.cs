using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("DetalleAccionFarmacologica", Schema = "Almacen")]
  public  class ADetalleAccionFarmacologica : AuditoriaColumna
    {
        [Key]
        public int iddetalleaccionfarma { get; set; }
        public int? idaccionfarma { get; set; }
        public int? idproducto { get; set; }   

        [NotMapped]
        public string acccionfarmacologica { get; set; }
    }
}
