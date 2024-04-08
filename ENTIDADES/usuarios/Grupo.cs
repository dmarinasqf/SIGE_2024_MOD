using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.usuarios
{
    [Table("Grupo")]
    public class Grupo
    {
        [Key]
        public int idgrupo { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
