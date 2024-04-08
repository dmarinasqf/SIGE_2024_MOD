using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("LugarSucursal")]

    public class LugarSucursal
    {
      
            [Key]
            public int idlugar { get; set; }
            public string descripcion { get; set; }
            public string estado { get; set; }
        
    }
}
