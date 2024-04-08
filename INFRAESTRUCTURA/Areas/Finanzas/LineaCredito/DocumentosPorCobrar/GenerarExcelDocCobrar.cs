using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito.DocumentosPorCobrar
{
   public class GenerarExcelDocCobrar
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public bool pagado { get; set; }
            public int idcliente { get; set; }
            public string path { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }

            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                try
                {
                    var stroreprocedure = "finanzas.sp_get_docuementosporpagar_cliente";
                    var parametros = new Dictionary<string, object>();
                    if (request.pagado)
                        parametros.Add("pagado", "1");
                    else
                        parametros.Add("pagado", "0");
                    parametros.Add("idcliente", request.idcliente);

                    var data = await ejecutarProcedimiento.HandlerDatatableAsync(stroreprocedure, parametros, "documentos" + request.idcliente.ToString());
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportecreditocliente" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";
                    string direccion = "/archivos/reportes/finanzas/";
                    string ruta = Path.Combine(request.path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, data);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }
               

            }
        }
    }
}
