using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class BuscarPedidoParaFacturar
    {
        public class Ejecutar : IRequest<object>
        {
            public int idpedido { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly IEjecutarProcedimiento procedimiento;
            private readonly Modelo db;
            private readonly IUser user;
            public Manejador(IEjecutarProcedimiento procedimiento_, Modelo db_,IUser _user)
            {
                procedimiento = procedimiento_;
                db = db_;
                user = _user;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {

                var pedido = await db.PEDIDO.FindAsync(e.idpedido);
                if (pedido is null)
                    return new mensajeJson("No existe el pedido N "+e.idpedido.ToString(),null);

                int sucursalLogueo = user.getIdSucursalCookie();
                if (sucursalLogueo == 159)//CALL CENTER
                    sucursalLogueo = Convert.ToInt32(pedido.sucursalfactura);
                if (pedido.sucursalfactura != sucursalLogueo)
                    return new mensajeJson("El pedido se facturará en otra sucursal", null);

                //var stroreprocedure = "Pedidos.sp_buscarpedido_para_facturar";
                var stroreprocedure = "Pedidos.sp_buscarpedido_para_facturar_v2";//EARTCOD1009
                var parametros = new Dictionary<string, object>();

                parametros.Add("pedido", e.idpedido);

                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                
                return new mensajeJson("ok",data);

            }
        }
    }
}
