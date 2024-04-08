using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("GuiaEntrada", Schema = "Almacen")]
  public  class AGuiaEntrada : AuditoriaColumna
    {
        [Key]
        public long idguiaentrada { get; set; }
        public long idguiasalida { get; set; }
        public string codigo { get; set; }
        public DateTime? fecha { get; set; }
        public string idempleado { get; set; }      
        public int idsucursal { get; set; }      
        public int idsucursalenvia { get; set; }      
        public int idalmacensucursal { get; set; } 
        public int idempresa { get; set; } 
        public string estado { get; set; }  
        public string observacion { get; set; }
        [ForeignKey("idempresa")]
        public Empresa empresa { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [NotMapped]
        public EMPLEADO empleado { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }
    }
}
