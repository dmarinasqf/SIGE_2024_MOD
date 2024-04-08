using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.preingreso
{
    [Table("GuiaDevolucion", Schema = "PreIngreso")]
    public class PIGuiaDevolucion:AuditoriaColumna
    {
        [Key]
        public int idguia { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }
        public string numeroguia { get; set; }        
        public DateTime? fecha { get; set; }
        public int idpreingreso { get; set; }
        public int idfactura { get; set; }
        public int iddocumento { get; set; }
        public int idsucursal { get; set; }
        public int idempresa { get; set; }
        public string tipo { get; set; }

        [ForeignKey("idpreingreso")]
        public PIPreingreso preingreso { get; set; }
        [ForeignKey("idfactura")]
        public PIFacturaPreingreso factura { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
        [NotMapped]
        public int? idcajasucursal { get; set; }
    }
}
