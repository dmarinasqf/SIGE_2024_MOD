using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.comercial
{
    [Table("Descuento", Schema = "Comercial")]

    public class Descuento:AuditoriaColumna
    {
        [Key]
        public int iddescuento { get; set; }
        public DateTime fechainicio { get; set; }
        public DateTime fechafin { get; set; }
        public string tipodescuento { get; set; }
        public string estado { get; set; }
        public string usuariovalida { get; set; }
        public string descripcion { get; set; }
        public string descuentopara { get; set; }
        public int? idprolab { get; set; }
        //public string canalesprecio { get; set; }//CAMPO AGREGADO
       
    }
}
