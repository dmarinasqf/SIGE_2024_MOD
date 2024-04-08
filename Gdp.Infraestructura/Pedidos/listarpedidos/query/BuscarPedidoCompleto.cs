using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class BuscarPedidoCompleto
    {
        public class Ejecutar : IRequest<object>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(Modelo context, IEjecutarProcedimiento procedimiento_)
            {
                db = context;
                procedimiento = procedimiento_;
            }
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var pedido = db.PEDIDO.Find(e.id);
                //var stroreprocedure = "Pedidos.sp_buscar_pedido_completo";
                var stroreprocedure = "Pedidos.sp_buscar_pedido_completo_v2";//EARTCOD1009
                var parametros = new Dictionary<string, object>();
                parametros.Add("pedido", e.id);
                var datapedido = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                if (pedido.tiporegistro == "DELIVERY")
                {
                    var datadelivery = await procedimiento.HandlerDictionaryAsync("Delivery.sp_get_datosenvio", parametros);
                    return new
                    {
                        pedido = datapedido,
                        delivery = datadelivery
                    };
                }
                return new
                {
                    pedido = datapedido,
                    delivery = "x"
                };

            }
        }
    }
}
