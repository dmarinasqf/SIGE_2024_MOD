using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Motorizado.command
{
    public class CambiarEstadoEntregaDelivery
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string estado { get; set; }
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
                    var obj = await db.ENTREGADELIVERY.FindAsync(e.id);
                    var delivery = await db.DELIVERY.FindAsync(obj.iddelivery);
                    var pedido = await db.PEDIDO.FindAsync(delivery.idpedido);
                    obj.estadoentrega = e.estado;
                    db.Update(obj);
                    await db.SaveChangesAsync();
                    pedido.estadoED = e.estado;
                    db.Update(pedido);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", obj);
                }
                catch (Exception err)
                {

                    return new mensajeJson(err.Message, null);

                }
            }

        }
    }
}
