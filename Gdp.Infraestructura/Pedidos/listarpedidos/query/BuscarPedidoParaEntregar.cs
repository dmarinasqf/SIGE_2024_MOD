using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class BuscarPedidoParaEntregar
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var pedido = await db.PEDIDO.FindAsync(e.id);
                    //if (pedido.idestado != "TERMINADO")
                    //    return new mensajeJson("El pedido no esta TERMINADO", null);
                    if (pedido is null)
                        return new mensajeJson("No existe pedido", null);

                    var detalle = await db.DETALLEPEDIDO.Where(x => x.idpedido == pedido.idpedido && (x.estado == "DEVUELTO"||x.estado=="ELIMINADO"))
                        .Select(x => new
                        {
                            x.descripcion,
                            x.subtotal,
                            x.cantidad,
                            x.precio,
                            x.iddetalle
                        }).ToListAsync();

                    return new mensajeJson("ok", new
                    {
                        detalle = detalle,
                        pedido = new
                        {
                            pedido.idpedido,
                            pedido.total,
                            pedido.saldo,
                            pedido.adelanto
                        }
                    });
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }
        }
    }
}
