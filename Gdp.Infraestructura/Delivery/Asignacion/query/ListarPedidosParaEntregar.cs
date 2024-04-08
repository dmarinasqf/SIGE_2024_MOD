using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Asignacion.query
{
   public  class ListarPedidosParaEntregar
    {
        public class EjecutarData : IRequest<DataTable>
        {
            public string idempleado { get; set; }
            public string estado { get; set; }
            public string fecha { get; set; }
         
        }

        public class Manejador : IRequestHandler<EjecutarData, DataTable>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<DataTable> Handle(EjecutarData e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.sp_getpedidoPorEntregar";

                var parametros = new Dictionary<string, object>();
             
                parametros.Add("IDEMPLEADO", e.idempleado);
                parametros.Add("FECHA", e.fecha ?? DateTime.Now.ToString("dd/MM/yyyy"));
                //parametros.Add("ESTADO", e.estado?? "EN RUTA");
              
                var data = await procedimiento.HandlerDatatableAsync(stroreprocedure, parametros,"Pedidos");
                return data;
            }

        }
    }
}
