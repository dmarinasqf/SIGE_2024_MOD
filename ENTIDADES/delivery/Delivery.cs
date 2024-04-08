using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.delivery
{
    [Table("DELIVERY")]
    public class Delivery : AuditoriaColumna
    {

        [Key]
        public int iddelivery { get; set; }
        public int idpedido { get; set; }
        public int? idsucursal { get; set; }
        public int? idsucursalentrega { get; set; }
      
        public string tipoentrega { get; set; }      
        public int? idtipoentrega { get; set; }      
        public string enviara { get; set; }
        public int? idprovincia { get; set; }
        public int? iddistrito { get; set; }
        public int? iddepartamento { get; set; }
        public string direcciondeenvio { get; set; }
        public string calle { get; set; }
        public string numero { get; set; }
        public string referencia1 { get; set; }
        public string referencia2 { get; set; }
        public string estado { get; set; }
        public string estadopago { get; set; }
        public string horaentrega { get; set; }
        public DateTime? fechaenvio { get; set; }
        public DateTime? fechaenviolocal { get; set; }
        public DateTime? fechaentrega { get; set; }


        public bool? isencomienda { get; set; }
        public int? idagencia { get; set; }
        public string claveagrencia { get; set; }
        public string docenvioagencia { get; set; }
        public string usuarioenviaagencia { get; set; }
        public string personarecoge { get; set; }
        public DateTime? fechaenvioagencia { get; set; }
        //[ForeignKey("idtipoentrega")]
        //public TipoEntrega tipoentrega { get; set; }
    }
}