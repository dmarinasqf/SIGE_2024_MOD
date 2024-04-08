using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.Dto
{
   public class ListaDto
    {
        public string codigoproducto { get; set; }
        public string codcliente { get; set; }
        public string formulacion { get; set; }
        public string descripcion { get; set; }
        public string presentacion { get; set; }
        public string etiqueta { get; set; }
        public string observacion { get; set; }
        public decimal? precio { get; set; }
        public decimal? precioxfraccion { get; set; }
    }
}
