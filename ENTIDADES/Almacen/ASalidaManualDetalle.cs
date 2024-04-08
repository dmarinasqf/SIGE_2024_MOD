using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("SalidaManualDetalle", Schema = "Almacen")]

    public class ADetalleSalidaManual
    {
        [Key]
        public int iddetalle { get; set; }
        public int idsalida { get; set; }
        public int? cantidad { get; set; }
        public bool? isblister { get; set; }
        public bool? isfraccion { get; set; }
        public long idstock { get; set; }
        public string estado { get; set; }
      

        [ForeignKey("idsalida")]
        public ASalidaManual salida { get; set; }
        [ForeignKey("idstock")]
        public AStockLoteProducto stockobj { get; set; }
       
    }
}
