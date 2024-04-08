using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("Constante")]
    public class Constante:AuditoriaColumna
    {
        [Key]
        public string idconstante { get; set; }
        public string valor { get; set; }
        public string categoria { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
    }
}
