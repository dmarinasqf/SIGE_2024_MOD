using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("Proforma", Schema = "Ventas")]
    public class Proforma:AuditoriaColumna
    {
        public Proforma()
        {
            estado = "";
        }
        [Key]
        public long idproforma { get; set; }
        public int idsucursal { get; set; }
        public int idempresa { get; set; }
        public int? idcliente { get; set; }
        public string estado { get; set; }
        public string codigoproforma { get; set; }
        public int? idpaciente { get; set; }
        public string tipo { get; set; }
        public int? idorigenreceta { get; set; }
        public int? idmedico { get; set; }

        [NotMapped]
        public string jsondetalle { get; set; }
        public DateTime  fecha { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idempresa")]
        public Empresa empresa { get; set; }
        [ForeignKey("idcliente")]
        public Cliente cliente { get; set; }
        
    }
}
