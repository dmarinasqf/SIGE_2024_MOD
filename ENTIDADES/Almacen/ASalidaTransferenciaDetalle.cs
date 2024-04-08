using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("SalidaTransferenciaDetalle", Schema = "Almacen")]
  public  class ASalidaTransferenciaDetalle : AuditoriaColumna
    {     
        [Key]
        public long idsalidatransferenciadetalle { get; set; }
        public int idproducto { get; set; }
        public long idstock { get; set; }
        public int cantidad { get; set; }  
        public string estado { get; set; }        
        public long idsalidatransferencia { get; set; }
        public string lote { get; set; }
        public string regsanitario { get; set; }
        public DateTime? fechavencimiento { get; set; }
        public int idalmacensucursal { get; set; }
        public bool? isfraccion { get; set; }
    }
}
