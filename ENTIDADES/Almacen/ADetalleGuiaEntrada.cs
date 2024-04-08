using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("DetalleGuiaEntrada", Schema = "Almacen")]
  public  class ADetalleGuiaEntrada : AuditoriaColumna
    {     
        [Key]
        public long iddetalleguiaentrada { get; set; }
        public long idguiaentrada { get; set; }
        public int idproducto { get; set; }
        public long idstock { get; set; }
        public int cantidadenviada { get; set; }        
        public int cantidadingresada { get; set; }        
        public string estado { get; set; }     
    }
}
