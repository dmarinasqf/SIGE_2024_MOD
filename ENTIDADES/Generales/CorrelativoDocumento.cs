using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("CorrelativoDocumento")]
    public class CorrelativoDocumento:AuditoriaColumna
    {
        [Key]
        public int idcorrelativo { get; set; }
        public int idcajasucursal { get; set; }
        public int iddocumento { get; set; }
        [MaxLength(10)]
        public string serie { get; set; }
        public int? empieza { get; set; }
        public int? termina { get; set; }
        public int? actual { get; set; }
        [MaxLength(18)]
        public string estado { get; set; }
        [ForeignKey("idcajasucursal")]
        public CajaSucursal cajasucursal { get; set; }
        [ForeignKey("iddocumento")]
        public FDocumentoTributario documentoTributario { get; set; }

    }
}
