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

namespace VisitadorMedico.Infraestructura.VisitaMedica.query
{
    public class ListarHorarioxMedicoxSucursalh
    {
        public class Ejecutar : IRequest<object>
        {
            public string codigoMed { get; set; }
            public string sucursalCodigo { get; set; }
            public string consultorioCodigo { get; set; }
            public string path { get; set; }
            public int top { get; set; }
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
                var stroreprocedure = "SP_ListarHorarioxMedicoxSucursalh";
                var parametros = new Dictionary<string, object>();

                parametros.Add("medicoCodigo", e.codigoMed);
                parametros.Add("sucursalCodigo", e.sucursalCodigo);
                parametros.Add("consultorioCodigo", e.consultorioCodigo);
                if (e.top > 1000)
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "ASinacionDeHorariosMedicos");
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
                        var nombre = "generalxpedido" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                        string direccion = "/archivos/horarios/ASignacion";
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
