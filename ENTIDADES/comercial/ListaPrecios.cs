using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.comercial
{
    [Table("ListaPrecios", Schema = "Comercial")]

    public class ListaPrecios:AuditoriaColumna
    {
        [Key]
        public int idlistaprecio { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string tipo { get; set; }
    }
}
