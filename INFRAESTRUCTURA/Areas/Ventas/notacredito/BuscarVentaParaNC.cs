using Erp.Persistencia.Repositorios.Common;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.notacredito
{
   public  class BuscarVentaParaNC
    {
        public class Ejecutar : IRequest<string>
        {
            public int idventa { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, string>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
            }

            public async Task<string> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Ventas.sp_get_ventacompleta_para_notacredito_v2";
                var parametros = new Dictionary<string, object>();               
                parametros.Add("idventa", request.idventa);
                var data = await ejecutarProcedimiento.HandlerDatatableAsync(stroreprocedure,parametros,"ventaparanc");
                return JsonConvert.SerializeObject(data);
            }
        }
    }
}
