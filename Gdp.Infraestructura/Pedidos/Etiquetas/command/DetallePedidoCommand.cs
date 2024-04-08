using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.Etiquetas.command
{
    public class DetallePedidoCommand
    {
        public class Ejecutar : IRequest<object> 
        {
            public int idpedido { get; set; }
        }

        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                try
                {
                    var detalle = await db.DETALLEPEDIDO.Where(x => x.idpedido == request.idpedido && x.estado=="HABILITADO").ToListAsync();

                    return detalle;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}
