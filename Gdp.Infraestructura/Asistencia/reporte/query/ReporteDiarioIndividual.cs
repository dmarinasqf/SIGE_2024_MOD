using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Asistencia.reporte
{
    public class ReporteDiarioIndividual
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public int top { get; set; }
            public string sucursal { get; set; }
            public string empleado { get; set; }
            public string path { get; set; }
            public string idempresa { get; set; }
        }
        public class Manejador:IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {
                procedimiento = procedimiento_;
            }
            
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "asistencia.SP_getReporteIndividual";
                var parametros = new Dictionary<string, object>();

                if (e.idempresa == null || e.idempresa == "0")
                    e.idempresa = "";
                if (e.sucursal == null || e.sucursal == "0")
                    e.sucursal = "";
                if (e.empleado == null)
                    e.empleado = "";
                if (e.fechainicio == null)
                    e.fechainicio = "";
                if (e.fechafin == null)
                    e.fechafin = "";

                parametros.Add("documento", e.empleado);
                parametros.Add("fechai", e.fechainicio);
                parametros.Add("fechaf", e.fechafin);
                parametros.Add("SUCURSAL", e.sucursal);
                parametros.Add("EMPRESA", e.idempresa);
                parametros.Add("CONSULTA", "CONSULTA");

                if (e.top > 1000)
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "ReporteDiario");
                    return await guardarExcel(e.path, tabla);
                }
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
            public async Task<mensajeJson> guardarExcel(string path, DataTable tabla)
            {
                try
                {
                    var data = await Task.Run(() =>
                    {

                        GuardarElementos save = new GuardarElementos();
                        var nombre = "ReporteDiario" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/reportes/asistencia/";
                        string ruta = Path.Combine(path + direccion, "");
                        string res = save.GenerateExcel(ruta, nombre, tabla);
                        if (res == "ok")
                            return new mensajeJson("ok", direccion + nombre);
                        else
                            return new mensajeJson(res, direccion + nombre);
                    });
                    return data;
                }
                catch (Exception e)
                {

                    return new mensajeJson(e.Message, null);
                }
            }

        }
    }
}
