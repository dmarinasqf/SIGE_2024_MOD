using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.finanzas
{
    [Table("Icoterms", Schema = "Finanzas")]

    public class FIcoterms
    {
        [Key]
        public string idicoterms { get; set; }
        public string descripcion { get; set; }
        public string estado { get; set; }
    }
}
