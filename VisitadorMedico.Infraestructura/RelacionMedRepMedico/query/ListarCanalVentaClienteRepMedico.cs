using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.RelacionMedRepMedico.query
{
    public class ListarCanalVentaClienteRepMedico
    {
        public class Ejecutar : IRequest<object>
        {
            public string idrepresentante { get; set; }
            public string idcliente { get; set; }
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
                var stroreprocedure = "visitadormedico.SP_ListarCanalVentaAsignadoxCliente_RM";
                var parametros = new Dictionary<string, object>();

                parametros.Add("idrepresentante", e.idrepresentante);
                parametros.Add("idcliente", e.idcliente);

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
        }
    }
}
