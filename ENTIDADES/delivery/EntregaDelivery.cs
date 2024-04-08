using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.delivery
{
    [Table("EntregaDelivery", Schema = "Delivery")]
    public class EntregaDelivery: AuditoriaColumna
    {
        [Key]
        public int identregadelivery { get; set; }
        public int? iddelivery { get; set; }
        public int? emp_codigo { get; set; }
        public string idpersonalasigna { get; set; }
        public string fotoentrega { get; set; }
        public string estadoentrega { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }
        public DateTime? fechaenruta { get; set; }
        public DateTime? fechaasignacion { get; set; }
        public DateTime? fechaentregapedido { get; set; }
        public DateTime? fechaentregado { get; set; }

    }
}
