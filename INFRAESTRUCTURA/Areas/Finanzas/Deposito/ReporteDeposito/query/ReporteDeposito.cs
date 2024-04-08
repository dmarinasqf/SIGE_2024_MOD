using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.query
{
    public class ReporteDeposito
    {
        public class Ejecutar : IRequest<mensajeJson> 
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string tipo { get; set; }
            public string path { get; set; }
        }


        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento _execute;

            public Manejador(IEjecutarProcedimiento execute)
            {
                _execute = execute;
            }
            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var mensajeJson = new mensajeJson();
                try
                {
                    var stroreprocedure = "SP_REPORTE_DEPOSITOS";
                    var parametros = new Dictionary<string, object>();

                    parametros.Add("FECHAINICIO", request.fechainicio ?? "");
                    parametros.Add("FECHAFIN", request.fechafin ?? "");
                    parametros.Add("TIPO", request.tipo ?? "EXPORTACION");

                    if (request.tipo == "EXPORTACION")
                    {
                        var tabla = await _execute.HandlerDatatableAsync(stroreprocedure, parametros, "DEPOSITO");
                        mensajeJson = await guardarExcel(request.path, tabla);

                    }
                    else
                    {
                        mensajeJson.objeto = await _execute.HandlerDictionaryAsync(stroreprocedure, parametros);
                        mensajeJson.mensaje = "ok";
                    }

                    
                }
                catch (Exception ex)
                {
                    mensajeJson.mensaje = ex.Message;
                }
              
                return mensajeJson;
            }
            public async Task<mensajeJson> guardarExcel(string path, DataTable tabla)
            {
                try
                {
                    var data = await Task.Run(() =>
                    {

                        GuardarElementos save = new GuardarElementos();
                        var nombre = "ReporteDepositos" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/reportes/depositos/";
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
