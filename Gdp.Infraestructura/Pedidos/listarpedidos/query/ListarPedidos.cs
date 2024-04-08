using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class ListarPedidos
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public string fechafin { get; set; }
            public string fechainicio { get; set; }
            public string horafin { get; set; }
            public string horainicio { get; set; }
            public string sucursal { get; set; }
            public string estadopedido { get; set; }
            public string cliente { get; set; }
            public string paciente { get; set; }
            public string empconsulta { get; set; }
            public string laboratorio { get; set; }
            public bool porusuario { get; set; }
            public int tipo { get; set; }
            public string vista { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly Modelo db;
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(Modelo context, IEjecutarProcedimiento procedimiento_)
            {
                db = context;
                procedimiento = procedimiento_;
            }
            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Pedidos.sp_consultar_pedidos_vista_venta_v2";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechafin", e.fechafin);
                parametros.Add("fechainicio", e.fechainicio);
                parametros.Add("cliente", e.cliente);
                parametros.Add("empconsulta", e.empconsulta);
                parametros.Add("estadopedido", e.estadopedido);
                parametros.Add("horafin", e.horafin);
                parametros.Add("horainicio", e.horainicio);
                parametros.Add("paciente", e.paciente);
                parametros.Add("porusuario", e.porusuario);
                parametros.Add("sucursal", e.sucursal);
                parametros.Add("laboratorio", e.laboratorio);
                parametros.Add("tipo", e.tipo);
                parametros.Add("vista", e.vista);

                var data = await procedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);
                stroreprocedure = "Pedidos.sp_consultar_pedidos_vista_venta_etiquetas_v2";
                //stroreprocedure = "Pedidos.sp_consultar_pedidos_vista_venta_etiquetas";
                var etiquetas = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                data.dataobject = new { etiquetas = etiquetas };
                return data;

            }
        }
    }
}
