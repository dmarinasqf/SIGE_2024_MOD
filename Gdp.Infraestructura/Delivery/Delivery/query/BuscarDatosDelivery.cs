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

namespace Gdp.Infraestructura.Delivery.query
{
    public class BuscarDatosDelivery
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
           
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
                    var delivery = await db.DELIVERY.Where(x => x.idpedido == e.idpedido).FirstOrDefaultAsync();
                    if (delivery is null)
                        return new mensajeJson("El pedido no es delivery", null);
                    else
                        return new mensajeJson("ok", delivery);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }
        }
    }
}
