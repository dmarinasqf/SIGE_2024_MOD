using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Finanzas
{
    [Table("Moneda", Schema = "Finanzas")]
    public class FMoneda:AuditoriaColumna
    {
        [Key]
        public int idmoneda { get; set; }
        public string nombre { get; set; }
        public string simbolo { get; set; }
        public string estado { get; set; }
        public string codigosunat { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal? tipodecambio { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal? preciocompra { get; set; }
        [Column(TypeName = "decimal(18, 4)")]
        public decimal? precioventa { get; set; }
    }
}
