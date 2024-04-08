using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Motorizado.query
{
   public  class BuscarPedidoEntrega
    {
        public class Ejecutar : IRequest<object>
        {
            public int id { get; set; }
        }

        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.SP_BUSCAR_ENTREGA_DELIVERY_COMPLETO";

                var parametros = new Dictionary<string, object>();
                parametros.Add("id", e.id);                

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }

        }
    }
}
