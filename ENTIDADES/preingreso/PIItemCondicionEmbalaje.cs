using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDADES.preingreso
{
    [Table("ItemCondicionEmbalaje", Schema = "PreIngreso")]

    public class PIItemCondicionEmbalaje
    {
        [Key]
        public string iditem { get; set; }
        public string estado { get; set; }
        public string descripcion { get; set; }
        public string tipo { get; set; }
        public string input { get; set; }
        public string html { get; set; }
    }
}
