using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Ventas.incentivos.query
{
    public class DescargarExcelReporteIncentivoDetallado
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string sucursales { get; set; }
            public string empleados { get; set; }
            public string tipo { get; set; }
            public int top { get; set; }
            public string path { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Ventas.sp_reporte_incentivos_detallado";
                var parametros = new Dictionary<string, object>();
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("fechafin", e.fechafin);
                parametros.Add("sucursales", e.sucursales);
                parametros.Add("empleados", e.empleados);
                parametros.Add("tipo", e.tipo);
                parametros.Add("top", e.top);

                var data = await ejecutarProcedimiento.HandlerDatatableAsync(stroreprocedure, parametros,"reporteincentivos");
                var res = await Task.Run(async () =>
                {

                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteincentivos" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/incentivos/";
                    string ruta = Path.Combine(e.path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, data);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return res;
             
            }
        }
    }
}
