using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.query
{
   public class BuscarProductosLista
    {
        public class Ejecutar : IRequest<object>
        {
            public string filtro { get; set; }
            public string cliente { get; set; }
            public PagineParams pagine { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Comercial.sp_buscar_productos_listacliente";
                var parametros = new Dictionary<string, object>();
                parametros.Add("filtro", e.filtro);
                parametros.Add("cliente", e.cliente);

                return await ejecutarProcedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);
            }
        }
    }
}
