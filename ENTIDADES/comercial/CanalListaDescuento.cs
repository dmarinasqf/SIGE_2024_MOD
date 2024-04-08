using ENTIDADES.comercial;
using ENTIDADES.ventas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{

    [Table("CanalListaDescuento", Schema = "Comercial")]
    public class ADristribucion
    {
        [Key]
        public int idcanalLista { get; set; }
        public int iddescuento { get; set; }      
        public string idcanalventa { get; set; }
    }
}
