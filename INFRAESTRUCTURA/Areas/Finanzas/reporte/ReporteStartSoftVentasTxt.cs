using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Finanzas.reporte
{
   public class ReporteStartSoftVentasTxt
    {
        public class Ejecutar : IRequest<mensajeJson> {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string path { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Ventas.sp_reporte_starsoft";
                var parametros = new Dictionary<string, object>();
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("fechafin", e.fechafin);
              
                var data= await ejecutarProcedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                string datostxt = data[0]["reporte"].ToString();
                GuardarElementos save = new GuardarElementos();
                var nombre = DateTime.Now.ToString("yyyyMMddHHmm")+".txt";
                e.path += "/archivos/reportes/finanzas/startsoft";
                var res =  save.creartxt(e.path, datostxt, nombre);
                if (res == "ok")
                    return new mensajeJson("ok", "/archivos/reportes/finanzas/startsoft/" + nombre);
                else
                    return new mensajeJson(res, null);
            }
        }
    }
}
