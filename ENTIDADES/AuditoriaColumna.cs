using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES
{
    public class AuditoriaColumna
    {
        public string usuariocrea { get; set; }
        public string usuariomodifica { get; set; }
        public DateTime? fechacreacion { get; set; }
        public DateTime? fechaedicion { get; set; }
        [NotMapped]
        public bool?  iseditable { get; set; }//si es F no actualizar
    }
}
