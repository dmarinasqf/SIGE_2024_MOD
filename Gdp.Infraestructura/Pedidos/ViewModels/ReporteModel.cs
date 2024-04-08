using ENTIDADES.Almacen;
using ENTIDADES.Generales;
using ENTIDADES.pedidos;
using ENTIDADES.produccion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.ViewModels
{
    public class ReporteModel
    {
        public List<Empresa> empresas { get; set; }
        public List<TipoPedido> tipopedido { get; set; }
        public List<TipoFormulacion> tipoformulacion { get; set; }
        public List<ATipoProducto> tipoproducto { get; set; }
        public List<EstadoPedido> estadopedido { get; set; }
    }
}
