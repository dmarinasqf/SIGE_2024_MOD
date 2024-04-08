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
   public class EliminarEntregaDelivery
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

                    EntregaDelivery obj = await db.ENTREGADELIVERY.Where(x => x.iddelivery == e.id).FirstOrDefaultAsync();
                    if (obj.estadoentrega == "ASIGNADO")
                    {
                        db.ENTREGADELIVERY.Remove(obj);
                        db.SaveChanges();
                        return (new mensajeJson("ok", null));
                    }
                    else
                    {
                        return (new mensajeJson("No se puede eliminar la asignación, porque el estado del pedido es: " + obj.estadoentrega, null));
                    }
                }
                catch (Exception err)
                {
                    return (new mensajeJson(err.Message, null));
                }
            }

        }
    }
}

