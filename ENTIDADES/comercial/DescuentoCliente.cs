using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    //EARTCOD1008
    public class DescuentoCliente
    {
        public int iddescuentocliente { get; set; }
        public string nombredescuento { get; set; }
        public decimal descuentocanal { get; set; }
        public string fechainicio { get; set; }
        public string fechatermino { get; set; }
        public string productostipo { get; set; }
        public string canalesventa { get; set; }
        public string sucursales { get; set; }
        public bool? todos { get; set; }
        public int estado { get; set; }
        public int? usuariocrea { get; set; }
        public string fechacreacion { get; set; }
        public int? usuariomodifica { get; set; }
        public string fechaedicion { get; set; }
        public string jsondetalle { get; set; }
        public string clientes { get; set; }
    }
}
