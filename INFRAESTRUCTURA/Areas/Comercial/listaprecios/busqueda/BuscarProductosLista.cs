using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.listaprecios
{
   public class BuscarProductosLista
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public int top { get; set; }
            public int lista { get; set; }
            public string producto { get; set; }
            public string laboratorio { get; set; }
            public string tipo { get; set; }          
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }

            public async Task<PagineModel> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Comercial.SP_LISTAR_PRDUCTOS_X_LISTA_PRECIOS";
                var parametros = new Dictionary<string, object>();
                parametros.Add("TOP", request.top);
                parametros.Add("LISTA", request.lista);
                parametros.Add("PRODUCTO", request.producto);
                parametros.Add("LABORATORIO", request.laboratorio);
                parametros.Add("tipo", request.tipo);               
                return await ejecutarProcedimiento.HandlerPaginateAsync(request.pagine, stroreprocedure, parametros);

            }
        }
    }
}
