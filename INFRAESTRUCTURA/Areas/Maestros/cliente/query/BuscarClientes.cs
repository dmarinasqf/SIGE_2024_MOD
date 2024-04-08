using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.cliente.query
{
    public class BuscarClientes
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public string filtro { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }

            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.top is 0) e.top = 100;
                var stroreprocedure = "SP_BUSCARCLIENTES";
                var parametros = new Dictionary<string, object>();
                parametros.Add("top", e.top);
                parametros.Add("filtro", e.filtro);
                return await ejecutarProcedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);

            }
        }
    }
}
