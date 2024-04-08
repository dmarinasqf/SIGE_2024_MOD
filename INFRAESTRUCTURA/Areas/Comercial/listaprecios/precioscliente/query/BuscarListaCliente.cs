using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.query
{
 public   class BuscarListaCliente
    {
        public class Ejecutar : IRequest<object>
        {
            public string filtro { get; set; }
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
                var stroreprocedure = "Comercial.sp_listar_listacliente";
                var parametros = new Dictionary<string, object>();
                parametros.Add("filtro", e.filtro);
               
                return await ejecutarProcedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);
            }
        }
    }
}
