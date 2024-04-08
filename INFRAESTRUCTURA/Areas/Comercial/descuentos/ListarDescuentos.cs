using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.descuentos
{
   public class ListarDescuentos
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public string descripcion { get; set; }
            public string fechainicio { get; set; }
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
                var stroreprocedure = "Comercial.sp_listar_descuentos";
                var parametros = new Dictionary<string, object>();               
                parametros.Add("descripcion", request.descripcion);
                parametros.Add("fechainicio", request.fechainicio);             
                return await ejecutarProcedimiento.HandlerPaginateAsync(request.pagine, stroreprocedure, parametros);

            }
        }
    }
}
