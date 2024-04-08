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

namespace Erp.Infraestructura.Areas.Ventas.proforma.query
{
   public class BuscarProformaParaPedido
    {

        public class Ejecutar : IRequest<object>
        {
            public string codigo { get; set; }
            public int numdias { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            private readonly Modelo db;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_, Modelo db_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
                db = db_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var proforma = db.PROFORMA.Where(x => x.codigoproforma == e.codigo).ToList().LastOrDefault();
                if (proforma is null)
                    return new { mensaje = "No existe proforma" };
                if (e.numdias is 0)
                    e.numdias = 10;
                var fecha = DateTime.Now.AddDays(-e.numdias);
                if (proforma.fecha.Date >= fecha.Date)
                {
                    var stroreprocedure = "[Ventas].[sp_get_proforma_para_pedido]";
                    var parametros = new Dictionary<string, object>();
                    parametros.Add("idproforma", proforma.idproforma);
                    var data = await ejecutarProcedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                    return new mensajeJson { mensaje = "ok", objeto = data };
                }
                else
                {
                    return new { mensaje = $"La proforma N°{proforma.idproforma}, ha vencido." };

                }

               
          
            }
        }
    }
}
