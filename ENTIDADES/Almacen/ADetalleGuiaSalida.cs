using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("DetalleGuiaSalida", Schema = "Almacen")]
  public  class ADetalleGuiaSalida : AuditoriaColumna
    {     
        [Key]
        public long iddetalleguiasalida { get; set; }
        public int idproducto { get; set; }
        public long idstock { get; set; }
        public int cantidadgenerada { get; set; }        
        public int cantidadpicking { get; set; }        
        public int? cantidadanterior { get; set; }        
        public string estado { get; set; }        
        public long idguiasalida { get; set; }
        [NotMapped]
        public int idsucusaldestino { get; set; }
        [NotMapped]
        public string producto { get; set; }
        [NotMapped]
        public string lotecliente { get; set; }
        [NotMapped]
        public string fechavencimientocliente { get; set; }

    }
}
