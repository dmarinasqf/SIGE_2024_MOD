using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Vinali.Infraestructura.Ventas.command
{
   public class GenerarExcelVentasVinali
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
          
            public string fechafin { get; set; }
            public string fechainicio { get; set; }
            public string path { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {

            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {

                procedimiento = procedimiento_;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Facturador.sp_reporte_ventas";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("top", e.top);

                var data = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros,"reportevinali");

                var res = await Task.Run(() =>
                {
                 
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "lista" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventasvinali/";
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
