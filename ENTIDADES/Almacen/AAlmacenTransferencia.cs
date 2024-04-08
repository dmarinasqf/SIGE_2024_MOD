using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("AlmacenTransferencia", Schema = "Almacen")]
    public class AAlmacenTransferencia : AuditoriaColumna
    {
        [Key]
        public int idalmacentransferencia { get; set; }
        public string codigo { get; set; }
        public DateTime fechatraslado { get; set; }
        public int idempresa { get; set; }
        public int idsucursal { get; set; }
        public int anio { get; set; }
        public int idalmacensucursalorigen { get; set; }
        public int idalmacensucursaldestino { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }

        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
