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

namespace Vinali.Infraestructura.Ventas.query
{
    public class HistorialVentas
    {
        public class Ejecutar : IRequest<object>
        {

            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string sucursal { get; set; }
            public string tipoconsulta { get; set; }
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
                var stroreprocedure = "Facturador.SP_CONSULTAR_VENTA";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("tipoconsulta", e.tipoconsulta);
              
                if (e.tipoconsulta == "EXPORTACION")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "ReporteVinali");
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
                        var nombre = "ReporteVinali" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

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
