using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Generales
{
    [Table("Empresa")]
   public class Empresa:AuditoriaColumna
    {
        [Key]
        public int idempresa { get; set; }
        public string correlativo { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string celular { get; set; }
        public string imagen { get; set; }
        public string logofacturacion { get; set; }
        public string email { get; set; }
        public string ruc { get; set; }
        public string nombrecomercial { get; set; }
        public string codestablecimientosunat { get; set; }
        public string codigoubigeo { get; set; }
        public string paginaweb { get; set; }
    
        public int? idsucursalalmacen { get; set; }
        public int? idprovincia { get; set; }
        public int? iddistrito { get; set; }
        public int? iddepartamento { get; set; }


        [ForeignKey("idsucursalalmacen")]
        public SUCURSAL sucursalalmacen { get; set; }
        [ForeignKey("idprovincia")]
        public PROVINCIA provincia { get; set; }
        [ForeignKey("iddistrito")]
        public DISTRITO distrito { get; set; }
        [ForeignKey("iddepartamento")]
        public DEPARTAMENTO departamento { get; set; }
    }
}
