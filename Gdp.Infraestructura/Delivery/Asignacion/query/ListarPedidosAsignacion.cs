using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Asignacion.query
{
    public class ListarPedidosAsignacion
    {
        public class EjecutarData : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string sucursal { get; set; }
            public string tipoentrega { get; set; }
            public string horaentrega { get; set; }
            public string perfil { get; set; }
            public string empleado { get; set; }
          

        }

        public class Manejador : IRequestHandler<EjecutarData, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(IEjecutarProcedimiento procedimiento)
            {
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(EjecutarData e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Delivery.sp_getpedido_paraasignar";
             
                var parametros = new Dictionary<string, object>();
                parametros.Add("fechafin", e.fechafin?? DateTime.Now.ToString("dd/MM/yyyy"));
                parametros.Add("fechainicio", e.fechainicio?? DateTime.Now.ToString("dd/MM/yyyy"));
                parametros.Add("tipoentrega", e.tipoentrega);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("horaentrega", e.horaentrega);
                parametros.Add("perfil", e.perfil);
                parametros.Add("empleado", e.empleado);
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }

        }
    }
}
