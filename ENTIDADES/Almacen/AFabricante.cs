using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Fabricante", Schema = "Almacen")]
    public class AFabricante:AuditoriaColumna
    {
        [Key]
        public int idfabricante { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
