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
    public class AlertaDetalleSegunComplejidad
    {
        public class Ejecutar : IRequest<object>
        {
            public int suc_codigo { get; set; }
            public int idlaboratorio { get; set; }
            public DateTime fechainicio { get; set; }
            public DateTime fechafin { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {
                procedimiento = procedimiento_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "dbo.sp_pedido_alerta_complejidad";
                var parametros = new Dictionary<string, object>();

                parametros.Add("suc_codigo", e.suc_codigo);
                parametros.Add("idlaboratorio", e.idlaboratorio);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("fechafin", e.fechafin);

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
        }
    }
}
