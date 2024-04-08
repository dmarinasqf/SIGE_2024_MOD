using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("Almacen", Schema = "TipoSalida")]
   public class ATipoSalida: AuditoriaColumna
    {
        [Key]
		public int idtiposalida { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }
    }
}
