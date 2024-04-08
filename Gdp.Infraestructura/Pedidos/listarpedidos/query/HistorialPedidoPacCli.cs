using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
  public  class HistorialPedidoPacCli
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }        
            public string tipo { get; set; }
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {            
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador( IEjecutarProcedimiento procedimiento_)
            {                
                procedimiento = procedimiento_;
            }
            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Pedidos.sp_historial_paciente_cliente";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("id", e.id);              
                parametros.Add("tipo", e.tipo);

                var data = await procedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);              
                return data;

            }
        }
    }
}
