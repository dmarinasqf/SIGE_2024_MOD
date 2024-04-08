using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Ventas.incentivos.query
{
    public class ReporteIncentivosDetallado
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string sucursales { get; set; }
            public string empleados { get; set; }
            public string tipo { get; set; }
            public int top { get; set; }
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
                var stroreprocedure = "Ventas.sp_reporte_incentivos_detallado";
                var parametros = new Dictionary<string, object>();
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("fechafin", e.fechafin);
                parametros.Add("sucursales", e.sucursales);
                parametros.Add("empleados", e.empleados);
                parametros.Add("tipo", e.tipo);
                parametros.Add("top", e.top);
                
                var data = await ejecutarProcedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
        }
    }
}
