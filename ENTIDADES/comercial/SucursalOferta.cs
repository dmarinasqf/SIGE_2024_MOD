using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("SucursalOferta", Schema = "Comercial")]

    public class SucursalOferta:AuditoriaColumna
    {
        [Key]
        public int id { get; set; }
        public int idsucursal { get; set; }
        public int idoferta { get; set; }
        public string estado { get; set; }
        [ForeignKey("idoferta")]
        public Oferta oferta { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
    }
}
