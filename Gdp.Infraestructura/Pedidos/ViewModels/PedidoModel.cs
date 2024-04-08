using ENTIDADES.delivery;
using ENTIDADES.Generales;
using ENTIDADES.pedidos;
using ENTIDADES.produccion;
using ENTIDADES.ventas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.ViewModels
{
    public class PedidoModel
    {
        public List<TipoFormulacion> tipoformulacion { get; set; }
        public List<TipoPedido> tipopedido { get; set; }
        public List<TipoEntrega> tipoentrega { get; set; }
        public List<CanalVenta> canalventa { get; set; }
        public List<TipoPaciente> tipopaciente { get; set; }
        public List<SUCURSAL> sucursales { get; set; }
        public List<TipoVenta> tipoVentas { get; set; }
        public string IGV { get; set; }
    }
}
