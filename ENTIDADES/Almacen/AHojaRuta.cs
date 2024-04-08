using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("HOJARUTACABE", Schema = "Almacen")]
    public class AHojaRuta: AuditoriaColumna
    {
        [Key]
        public long numhojaruta { get; set; }
        public int idempresa { get; set; }
        public int idvehiculo { get; set; }
        public string nomchofer { get; set; }
        public string ayudante { get; set; }
        public string estado { get; set; }
        public int usuacrea { get; set; }
        public DateTime fechacreacion { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }

    }
}
