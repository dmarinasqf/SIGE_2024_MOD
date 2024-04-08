using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("ContactosProveedor", Schema = "Compras")]
    public class CContactosProveedor
    {
        [Key]
        public int idcontacto { get; set; }
        public int idproveedor { get; set; }
        public string nombres{ get; set; }
        public string celular{ get; set; }
        public string telefono{ get; set; }
        public string correo{ get; set; }
        public string documento{ get; set; }
        public string estado{ get; set; }
        public CContactosProveedor()
        {
           nombres = "";
            celular = "";
            telefono = "";
        }
    }
}
