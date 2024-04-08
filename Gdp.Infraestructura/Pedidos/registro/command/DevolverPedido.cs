using ENTIDADES.Identity;
using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro.command
{
    public class DevolverPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public int idempleado { get; set; }
            public string motivo { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;

            public Manejador(Modelo context, IUser user_, UserManager<AppUser> Appuser_)
            {
                db = context;
                user = user_;

            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {

                    if (db.DEVOLUCIONPEDIDO.Where(x => x.idpedido == e.idpedido).Any())
                        return new mensajeJson("Ya se ha registrado una devolucion del pedido", null);
                    var pedido = db.PEDIDO.Find(e.idpedido);
                    if (pedido is null)
                        return new mensajeJson("No existe el pedido", null);
                    pedido.idestado = "DEVUELTO";
                    db.Update(pedido);
                    await db.SaveChangesAsync();
                    DevolucionPedido devolver = new DevolucionPedido();
                    devolver.idpedido = e.idpedido;
                    devolver.motivodevolucion = e.motivo;
                    devolver.fechadevolucion = DateTime.Now;
                    devolver.sucursalenvia = pedido.sucursalfactura;
                    devolver.usuariodevuelve = e.idempleado;
                    await db.AddAsync(devolver);
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
