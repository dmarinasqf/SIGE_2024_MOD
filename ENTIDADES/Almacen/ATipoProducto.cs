using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("TipoProducto", Schema = "Almacen")]
    public class ATipoProducto
    { 
        [Key]
        public string idtipoproducto { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }       
	
    }
}
