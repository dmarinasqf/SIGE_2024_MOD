using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("CLIENTE_TERCERO")]
   public class Cliente:AuditoriaColumna
    {
        [Key]
        [Column("cliTercero_codigo")]
        public int idcliente { get; set; }

        public string nrodocumento { get; set; }

        public string direccion { get; set; }
        [Column("dep_codigo")]
        public int? iddepartamento { get; set; }
        public int? iddocumento { get; set; }
        public int? iddistrito { get; set; }
        public int? idprovincia { get; set; }
        public string descripcion { get; set; }
        public string nombrecomercial { get; set; }
        public string apepaterno { get; set; }
        public string apematerno { get; set; }
        public string telefono { get; set; }
        public string celular { get; set; }
        public string email { get; set; }
        public string estado { get; set; }
        public string tipoCliente { get; set; }
        public string direccionentrega { get; set; }
        public string logo { get; set; }
        public int? idtipocliente { get; set; }
        public DateTime? fechanacimiento { get; set; }
        //[NotMapped]
        //public bool? esasociado { get; set; }

        [NotMapped]
        public string departamento { get; set; }
        [NotMapped]
        public string cmp { get; set; }
        [NotMapped]
        public string directortecnico { get; set; }
        [NotMapped]
        public Medico medico { get; set; }
        [NotMapped]
        public ClienteAsociado clienteasociado { get; set; }
    }
}
