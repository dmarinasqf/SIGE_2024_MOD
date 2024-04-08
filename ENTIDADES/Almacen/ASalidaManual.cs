using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("SalidaManual", Schema = "Almacen")]

    public class ASalidaManual:AuditoriaColumna
    {
        [Key]
        public int idsalida { get; set; }
        public DateTime? fecha { get; set; }
        public int idsucursal { get; set; }
        public int idempresa { get; set; }
        public string estado { get; set; }
        public string motivo { get; set; }
        public string seriedoc { get; set; }
        public string numdoc { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idempresa")]
        public Empresa empresa { get; set; }
    }
}
