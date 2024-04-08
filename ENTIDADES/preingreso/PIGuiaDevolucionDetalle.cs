using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.preingreso
{
    [Table("GuiaDevolucionDetalle", Schema = "PreIngreso")]
    public  class PIGuiaDevolucionDetalle
    {
        [Key]
        public int iddetalle { get; set; }
        public int idguia { get; set; }
        //public string motivodevolucion { get; set; }
        public string estado { get; set; }
        public bool? isfraccion { get; set; }
        public int? iddetallepreingreso { get; set; }
        public int? idproducto { get; set; }
        public decimal? cantidad { get; set; }
        public string Lote { get; set; }
        public string fechavencimiento { get; set; }
        public string idmotivodevolucion { get; set; }
        [ForeignKey("idguia")]
        public PIGuiaDevolucion guiadevolucion { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
        [ForeignKey("iddetallepreingreso")]
        public PIPreingresoDetalle detallepreingreso { get; set; }
    }
}
