using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.pedidos
{
    public class ReporteGeneralExportar
    {
        public string fechainicio { get; set; }
        public string fechafin { get; set; }
        public string horainicio { get; set; }
        public string horafin { get; set; }
        public int sucursal { get; set; }
        public string laboratorio { get; set; }
        public int tipopedido { get; set; }
        public string perfil { get; set; }
        public string vendedor { get; set; }
        public string medico { get; set; }
        public string paciente { get; set; }
        public string cliente { get; set; }
        public string origenreceta { get; set; }
        public string estado { get; set; }
        public string empconsulta { get; set; }
        public string tipoempresa { get; set; }
        public string consulta { get; set; }
        public bool fechafacturacion { get; set; }
        public string tipoproducto { get; set; }
        public string tipoformulacion { get; set; }
        public string path { get; set; }
    }
}
