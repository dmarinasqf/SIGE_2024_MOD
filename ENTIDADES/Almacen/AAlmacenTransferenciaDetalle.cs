using ENTIDADES;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.Almacen
{
    [Table("AlmacenTransferenciaDetalle", Schema = "Almacen")]
    public class AAlmacenTransferenciaDetalle : AuditoriaColumna
    {
        [Key]
        public int idalmacentransferenciadetalle { get; set; }
        public int idalmacentransferencia { get; set; }
        public int idproducto { get; set; }
        public int idstockorigen { get; set; }
        public decimal cantidad { get; set; }
        public int idstockdestino { get; set; }
        public string estado { get; set; }
    }
}
