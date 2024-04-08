using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.usuarios
{
    [Table("ModulosGrupo")]
    public class ModulosGrupo
    {
        [Key]
        public int idmodulo { get; set; }       
        public int idgrupo { get; set; }      
        public string roleid { get; set; }
        [NotMapped]
        public string rol { get; set; }
        
    }
}
