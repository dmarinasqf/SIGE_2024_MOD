using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Vinali.Infraestructura.Ventas.query
{
    public class ReporteVentasVinali
    {

        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public string fechafin { get; set; }
            public string fechainicio { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {

            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {

                procedimiento = procedimiento_;
            }
            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Facturador.sp_reporte_ventas";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("top", e.top);

                var data = await procedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);
             
                return data;

            }
        }
    }
}
