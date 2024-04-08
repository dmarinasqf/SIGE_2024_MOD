using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("SubClase", Schema = "Almacen")]
    public  class ASubClase:AuditoriaColumna
    {
        [Key]
        public int idsubclase { get; set; }
        public int? idclase { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }        	 	 	
        [NotMapped]
        public string clase { get; set; }        	 	 	
    }
}
