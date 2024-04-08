using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("ProductoDigemid", Schema = "Almacen")]

    public class AProductoDigemid
    {
        [Key]
        public string codigodigemid { get; set; }
        public string nombre { get; set; }
        public string concentracion { get; set; }
        public string forma { get; set; }
        public string formasimplificada { get; set; }
        public string presentacion { get; set; }
        public string fraccion { get; set; }
        public string laboratorio { get; set; }
        public string regsanitario { get; set; }
        public string fechavenregsanitario { get; set; }
        public string situacion { get; set; }
        public string estado { get; set; }
    }
}
