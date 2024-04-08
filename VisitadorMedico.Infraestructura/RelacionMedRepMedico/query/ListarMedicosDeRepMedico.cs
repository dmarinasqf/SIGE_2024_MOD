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

namespace VisitadorMedico.Infraestructura.RelacionMedRepMedico.query
{
    public class ListarMedicosDeRepMedico
    {
        public class Ejecutar : IRequest<object>
        {
            public string idrepresentante { get; set; }
            public string tipo { get; set; }
            public string filtro { get; set; }
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
                var stroreprocedure = "visitadormedico.SP_ListarMedicosAsignadosxcanalventa_RM";
                var parametros = new Dictionary<string, object>();
            
                parametros.Add("emp_codigo", e.idrepresentante);
                parametros.Add("filtro", e.filtro);
                parametros.Add("top", e.top);
                parametros.Add("tipo", e.tipo);

                if (e.tipo == "EXPORTAR")
                {
                    var tabla = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "MedicosDeRepMedico");
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
                        string nombre = "reportemedico_repmedico"+ DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";                    
                        GuardarElementos save = new GuardarElementos();
                        string direccion = "/archivos/reportes/visitadormedico/";
                        string ruta = Path.Combine(obj.path + direccion, "");
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
