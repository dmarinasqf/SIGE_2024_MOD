using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Almacen", Schema = "Almacen")]
   public class AAlmacen: AuditoriaColumna
    {
        [Key]
		public int idalmacen { get; set; }
		public string descripcion { get; set; }
		public string tipoalmacen { get; set; }
		public string estado { get; set; }
        public string idtipoproducto { get; set; }

    }
}
