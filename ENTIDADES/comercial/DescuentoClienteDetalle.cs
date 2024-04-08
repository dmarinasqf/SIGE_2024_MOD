using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.comercial
{
    public class DescuentoClienteDetalle
    {
        public int iddescuentoclientedetalle { get; set; }
        public int iddescuentocliente { get; set; }
        public int idcliente { get; set; }
        public int estado { get; set; }
        public int usuariocrea { get; set; }
        public string fechacreacion { get; set; }
        public int usuariomodifica { get; set; }
        public string fechaedicion { get; set; }
    }
}
