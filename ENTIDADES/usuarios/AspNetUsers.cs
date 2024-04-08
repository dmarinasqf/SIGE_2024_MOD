using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.usuarios
{
    [Table("AspNetUsers")]
    public class AspNetUsers
    {
        [Key]
        public string Id { get; set; }
        public string UserName { get; set; }
    }
}
