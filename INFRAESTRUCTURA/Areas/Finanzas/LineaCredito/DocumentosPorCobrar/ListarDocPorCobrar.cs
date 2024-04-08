using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using Erp.Persistencia.Modelos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito.DocumentosPorCobrar
{
   public  class ListarDocPorCobrar
    {
        public class Ejecutar : IRequest<PagineModel> {
            public PagineParams pagine { get; set; }
          
            public bool pagado { get; set; }
            public int idcliente { get; set; }
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
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
                var stroreprocedure = "finanzas.sp_get_docuementosporpagar_cliente";
                var parametros = new Dictionary<string, object>();
                if (request.pagado)
                    parametros.Add("pagado", "1");
                else
                    parametros.Add("pagado", "0");

                parametros.Add("idcliente", request.idcliente);
                parametros.Add("fechainicio", request.fechainicio);
                parametros.Add("fechafin", request.fechafin);
                return await ejecutarProcedimiento.HandlerPaginateAsync(request.pagine, stroreprocedure, parametros);

            }
        }
    }
}
