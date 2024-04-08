using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.Etiquetas.query

{
    public class DatosEtiquetas
    {
        public class Ejecutar : IRequest <object>
        {
            public int idpedido { get; set; }
        }


        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento _procedimiento)
            {
                procedimiento = _procedimiento;
            }

            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var sql = "SP_DATOSETIQUETA";
                var parameters = new Dictionary<string, object>();

                parameters.Add("@PEDIDO", request.idpedido);

                var data = await procedimiento.HandlerDictionaryAsync(sql, parameters);
                return data;
            }
        }

    }
}
