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

namespace Gdp.Infraestructura.LibroReceta.query
{
   public class Reporte
    {
        public class Ejecutar : IRequest<object>
        {

            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string sucursal { get; set; }
            public string consulta { get; set; }           
            public string tipolibro { get; set; }           
            public string tiposucursal { get; set; }           
            public string nombresucursal { get; set; }           
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
                var stroreprocedure = "sp_reportelibrorecetas";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("consulta", e.consulta);
                parametros.Add("tipolibro", e.tipolibro);
                parametros.Add("tiposucursal", e.tiposucursal);
               

                if (e.consulta == "EXPORTACION")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "LibroRecetas"+e.tipolibro??"");
                    return await guardarExcel(e, tabla);
                }
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
            public async Task<mensajeJson> guardarExcel(Ejecutar obj, DataTable tabla)
            {
                try
                {
                    var data = await Task.Run(() =>
                    {
                        string nombre = "";
                        string presentacion = "";
                        if (obj.tipolibro == "LR")
                        {
                            nombre = obj.nombresucursal + "_" + obj.tipolibro + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";
                            presentacion = "NOMBRE DEL ESTABLECIMIENTO: " + obj.nombresucursal;
                        }
                        if (obj.tipolibro == "SP")
                        {
                            nombre = obj.nombresucursal + "_" + obj.tipolibro + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";
                            presentacion = "NOMBRE DEL ESTABLECIMIENTO: " + obj.nombresucursal;
                        }
                        if (obj.tipolibro == "CA")
                        {
                            nombre = obj.nombresucursal + "_" + obj.tipolibro + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";
                            presentacion = "NOMBRE DEL ESTABLECIMIENTO: " + obj.nombresucursal;
                        }
                        var fechas = "FECHA: DEL " + obj.fechainicio + " EL " + obj.fechafin;
                        

                        GuardarElementos save = new GuardarElementos();
                      

                        string direccion = "/archivos/reportes/librorecetas/";
                        string ruta = Path.Combine(obj.path + direccion, "");
                        string res = save.GenerarExcelConPresentacion(ruta, nombre, tabla,presentacion,fechas);
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
