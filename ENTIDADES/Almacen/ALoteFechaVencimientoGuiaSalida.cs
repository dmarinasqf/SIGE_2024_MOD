using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Almacen
{
    [Table("LoteFechaVencimientoGuiaSalida", Schema = "Almacen")]
    public class ALoteFechaVencimientoGuiaSalida : AuditoriaColumna
    {
        [Key]
        public long idlotefechavencimientoguiasalida { get; set; }

        public long iddetalleguiasalida { get; set; }
        public string lote { get; set; }
        public DateTime fechavencimiento { get; set; }
        public int estado { get; set; }
    }
}
