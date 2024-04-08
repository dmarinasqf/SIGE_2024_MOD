using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("PrincipioActivo", Schema = "Almacen")]

    public class APrincipioActivo:AuditoriaColumna
    {
        [Key]
        public int idprincipio { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
