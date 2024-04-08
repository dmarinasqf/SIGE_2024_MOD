using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class BuscarDetallePedido
    {
        public class Ejecutar : IRequest<object>
        {
            public int idpedido { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
         
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador( IEjecutarProcedimiento procedimiento_)
            {           
                procedimiento = procedimiento_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Pedidos.sp_get_detalle_pedido";
                var parametros = new Dictionary<string, object>();

                parametros.Add("idpedido", e.idpedido);

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
        }
    }
}
