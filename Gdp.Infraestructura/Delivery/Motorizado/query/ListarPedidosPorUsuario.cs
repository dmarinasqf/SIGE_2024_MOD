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
    public class ListarPedidosPorUsuario
    {
       public   class EjecutarData : IRequest<object>
        {
            public string estado { get; set; }
            public string empleado { get; set; }


        }

        public class Manejador : IRequestHandler<EjecutarData, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(EjecutarData e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.SP_PEDIDOS_ACEPTAR_MOTORIZADO";

                var parametros = new Dictionary<string, object>();             
                parametros.Add("EMPLEADO", e.empleado);
                parametros.Add("ESTADO", e.estado);
            
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }

        }
    }
}
