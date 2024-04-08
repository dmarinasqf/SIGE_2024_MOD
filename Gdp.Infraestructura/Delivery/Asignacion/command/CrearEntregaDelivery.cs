using Erp.Entidades.delivery;
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

namespace Gdp.Infraestructura.Delivery.Asignacion.command
{
  public   class CrearEntregaDelivery
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public List<EntregaDelivery> entrega { get; set; }
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
                    for (int i = 0; i < e.entrega.Count; i++)
                    {
                        EntregaDelivery aux = await db.ENTREGADELIVERY.Where(x => x.iddelivery == e.entrega[i].iddelivery).FirstOrDefaultAsync();
                        if (aux is null)
                        {
                            var delivery = db.DELIVERY.Find(e.entrega[i].iddelivery);
                            var pedido = db.PEDIDO.Find(delivery.idpedido);
                            var fechaentregadelivery = delivery.fechaentrega;
                            e.entrega[i].fechaasignacion = DateTime.Now;
                            //entrega[i].estadoentrega = "ASIGNADO";
                            e.entrega[i].estado = "HABILITADO";
                            e.entrega[i].fechaentregapedido = (fechaentregadelivery ?? DateTime.Now);
                            //registrar entregas de pedidos delivery
                            db.Add(e.entrega[i]);
                            await db.SaveChangesAsync();
                            //cambiar estado pedido
                            //pedido.idestado = "ASIGNADO";
                            pedido.estadoED = "ASIGNADO";
                            db.Update(pedido);
                            await db.SaveChangesAsync();
                        }
                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }

        }
    }
}
