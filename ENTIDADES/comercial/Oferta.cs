using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("Oferta", Schema = "Comercial")]

    public class Oferta:AuditoriaColumna
    {
        [Key]
        public int idoferta { get; set; }
        public string estado { get; set; }
        public string nombre { get; set; }
        public DateTime?    fechainicio { get; set; }
        public DateTime?    fechafin { get; set; }
        public string tipo { get; set; }
        public bool? reqcliente { get; set; }
        public bool? grabarcosto0 { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
        [NotMapped]
        public string jsonobsequios { get; set; }
    }
}
