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

namespace Gdp.Infraestructura.Pedidos.reportes
{
    public class ReporteDelivery
    {
        public class Ejecutar : IRequest<object> 
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string tipo { get; set; }
            public bool esencomienda { get; set; }
            public string path { get; set; }
        }

        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento _procedimiento)
            {
                procedimiento = _procedimiento;
            }
            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var stroreprocedure = "SP_REPORTE_DELIVERY";
                var parametros = new Dictionary<string, object>();

                parametros.Add("FECHAINICIO", request.fechainicio ?? "");
                parametros.Add("FECHAFIN", request.fechafin ?? "");
                parametros.Add("TIPO", request.tipo ?? "CONSULTA");
                parametros.Add("ESENCOMIENDA", request.esencomienda ? "1" : "");
                

                if (request.tipo == "EXPORTACION")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "Delivery");
                    return await guardarExcel(request.path, tabla);
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
                        var nombre = "ReporteDelivery" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/reportes/pedidos/";
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
