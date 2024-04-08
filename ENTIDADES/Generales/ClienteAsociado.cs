using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ENTIDADES.Generales
{
    [Table("ClienteAsociado")]
    public  class ClienteAsociado
    {
        [Key]
        public int idclienteasociado { get; set; }
        public string contacto { get; set; }
        public string telefonocontacto { get; set; }
        public string celularcontacto { get; set; }
        public string horaatencion { get; set; }
        public int? idmedico { get; set; }
        public string usuario { get; set; }
        public string clave { get; set; }
        public int? idsucursal { get; set; }
        public int? idcondicionpago { get; set; }
        public int idcliente { get; set; }
        
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idsucursal")]
        public Cliente cliente { get; set; }
        [ForeignKey("idmedico")]
        public Medico medico { get; set; }

        [NotMapped]
        public string laboratorio { get; set; }
        [NotMapped]
        public string cmp { get; set; }
        [NotMapped]

        public string nombremedico { get; set; }
    }
}
