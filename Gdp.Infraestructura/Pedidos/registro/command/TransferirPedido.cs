using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro.command
{
   public class TransferirPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public int idempleado { get; set; }
            public string laboratorio { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;

            public Manejador(Modelo context, IUser user_)
            {
                db = context;
                user = user_;

            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var pedido = db.PEDIDO.Find(e.idpedido);
                    if (pedido.idestado != "PENDIENTE")
                        return new mensajeJson("El pedido no esta PENDIENTE", null);
                    pedido.laboratoriotransfiere =int.Parse( pedido.laboratorio);
                    pedido.laboratorio = e.laboratorio;
                    pedido.usuariotransfiere = e.idempleado;
                    pedido.fechatransferencia = DateTime.Now;

                    db.Update(pedido);
                    await db.SaveChangesAsync();
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
