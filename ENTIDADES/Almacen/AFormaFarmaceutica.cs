using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("FormaFarmaceutica", Schema = "Almacen")]

    public class AFormaFarmaceutica:AuditoriaColumna
    {
        [Key]
        public int idformafarma { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
