using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("SucursalLaboratorio")]
    public class SucursalLaboratorio : AuditoriaColumna
    {
        [Key]
        public int idsucursallab { get; set; }
        public int idsucursal { get; set; }
        public int idlaboratorio { get; set; }
        public string estado { get; set; }
    }
}
