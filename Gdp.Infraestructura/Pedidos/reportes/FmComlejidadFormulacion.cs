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
    public class FmComlejidadFormulacion
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string laboratorio { get; set; }
            public string complejidad { get; set; }
            public string tipoReporte { get; set; }
            public string formulador { get; set; }
            public string consulta{ get; set; }
            public string path { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "SP_REPORTE_FM_COMPLEJIDAD";
                var parametros = new Dictionary<string, object>();
                if (e.tipoReporte == null) e.tipoReporte = "COMPLETO";
                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("sucursal", e.laboratorio);
                parametros.Add("complejidad", e.complejidad);
                parametros.Add("formulador", e.formulador);
                parametros.Add("tipo", e.tipoReporte);
                parametros.Add("consulta", e.consulta);

                if (e.top > 1000)
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "FMComplejidad_Formulacion");
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
                        var nombre = "FMComplejidad_Formulacion" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

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
