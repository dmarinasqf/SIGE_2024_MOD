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
    public class ReporteProduccionxLaboratorio
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string laboratorio { get; set; }
            public string perfil { get; set; }
            public string estado { get; set; }
            public string empleado { get; set; }
            public string consulta { get; set; }
            public int top { get; set; }
            public string path { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento_)
            {

                procedimiento = procedimiento_;
            }
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "SP_PRODUCCIONXLABORATORIO";
                var parametros = new Dictionary<string, object>();

                parametros.Add("FECHAINICIO", e.fechainicio);
                parametros.Add("FECHAFIN", e.fechafin);
                parametros.Add("LABORATORIO", e.laboratorio);
                parametros.Add("PERFIL", e.perfil);
                parametros.Add("ESTADO", e.estado);
                parametros.Add("EMPCONSULTA", e.empleado);
                parametros.Add("CONSULTA", e.consulta);
                if (e.top > 1000)
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "ProduccionxLaboratorio");
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
                        var nombre = "ProduccionxLaboratorio" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

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
