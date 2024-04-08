using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("CondicionPago", Schema = "Finanzas")]
   public class FCondicionPago : AuditoriaColumna
    {
        [Key]
		public int idcondicionpago { get; set; }
		public string descripcion { get; set; }
		public int ndias { get; set; }
		public string estado { get; set; }
	}
}
