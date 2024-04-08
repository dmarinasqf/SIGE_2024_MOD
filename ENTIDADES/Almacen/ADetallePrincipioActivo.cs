using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("DetallePrincipioActivo", Schema = "Almacen")]

    public class ADetallePrincipioActivo
    {
        [Key]
        public int iddetalle { get; set; }
        public int idproducto { get; set; }
        public int idprincipio { get; set; }
        public int? idunidadmedida { get; set; }
        public string codconcentracion { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
        [ForeignKey("idprincipio")]
        public APrincipioActivo principioobj { get; set; }
        [ForeignKey("idunidadmedida")]
        public AUnidadMedida unidadmedida { get; set; }
    }
}