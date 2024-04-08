using ENTIDADES.Almacen;
using ENTIDADES.ventas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Almacen
{

    [Table("Distribucion", Schema = "Almacen")]
    public class ADristribucionProducto
    {
        [Key]
        public int IdDistribucion { get; set; }

        public DateTime Fechacreacion { get; set; }
        public int idsucursalorigen { get; set; }
        public int idempresaorigen { get; set; }
        public int usuariocreacion { get; set; }
        public int estado { get; set; }
      

    }
}
