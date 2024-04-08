using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.compras
{
    [Table("RepresentanteLaboratorio", Schema = "Compras")]
    public class CRepresentanteLaboratorio
    {
        [Key]
        public int idrepresentante { get; set; }
        public int idlaboratorio { get; set; }
        public string nombres { get; set; }
        public string celular { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public string documento { get; set; }
        public string estado { get; set; }
        [NotMapped]
        public ALaboratorio  laboratorio { get; set; }
        public CRepresentanteLaboratorio()
        {
            nombres = "";
            celular = "";
            telefono = "";
        }
    }
}
