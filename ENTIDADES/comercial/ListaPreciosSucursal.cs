using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("ListaPreciosSucursal", Schema = "Comercial")]
    public class ListaPreciosSucursal:AuditoriaColumna
    {
        [Key]
        public int idlistasucursal { get; set; }
        public int? idlista { get; set; }
        public int? idsucursal { get; set; }
        public string estado { get; set; }

        [ForeignKey("idlista")]
        public ListaPrecios lista { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }

    }
}
