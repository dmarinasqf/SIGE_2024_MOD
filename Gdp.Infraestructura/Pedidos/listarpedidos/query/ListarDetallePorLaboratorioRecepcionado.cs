using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class ListarDetallePorLaboratorioRecepcionado
    {
        public class Ejecutar : IRequest<object>
        {
            public int idlaboratorio { get; set; }
            public int idlaboratorioOrigen { get; set; }
            public string nombrecodigoproducto { get; set; }
            public string estadoproceso { get; set; }
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
                var stroreprocedure = "Pedidos.sp_buscar_detallepedido_recepcionado";
                var parametros = new Dictionary<string, object>();

                if (e.nombrecodigoproducto is null) e.nombrecodigoproducto = "";
                if (e.estadoproceso is null) e.estadoproceso = "";
                parametros.Add("laboratorioCabeceras", e.idlaboratorio);
                parametros.Add("idlaboratorioOrigen", e.idlaboratorioOrigen);
                parametros.Add("nombrecodigoproducto", e.nombrecodigoproducto);
                parametros.Add("estadoProceso", e.estadoproceso);

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
        }
    }
}
