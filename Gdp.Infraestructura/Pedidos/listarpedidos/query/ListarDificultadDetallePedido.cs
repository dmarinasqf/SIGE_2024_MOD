using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class ListarDificultadDetallePedido
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public int iddificultad { get; set; }
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string laboratorio { get; set; }
            public string sucursal { get; set; }
        }

        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {
                procedimiento = procedimiento_;
            }

            public async Task<PagineModel> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Pedidos.sp_consultar_pedidos_dificultad";
                var parametros = new Dictionary<string, object>();

                parametros.Add("IDDIFICULTAD", request.iddificultad);
                parametros.Add("FECHAINICIO", request.fechainicio);
                parametros.Add("FECHAFIN", request.fechafin);
                parametros.Add("LABORATORIO", request.laboratorio);
                parametros.Add("SUCURSAL", request.sucursal);

                var data = await procedimiento.HandlerPaginateAsync(request.pagine, stroreprocedure, parametros);
                return data;
            }
        }
    }
}
