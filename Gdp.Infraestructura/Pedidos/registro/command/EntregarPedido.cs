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
   public class EntregarPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public decimal? monto { get; set; }
            public int? idtipopago { get; set; }
            public DateTime? fechafacturacion { get; set; }
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
                    var pedido = await db.PEDIDO.FindAsync(e.idpedido);
                    pedido.saldo = 0;
                    pedido.idestado = "ENTREGADO";
                    pedido.fechaentregado = DateTime.Now;
                    pedido.usuarioentrega =int.Parse( user.getIdUserSession());
                    pedido.fechafacturacion = e.fechafacturacion;
                    db.Update(pedido);
                    await db.SaveChangesAsync();

                    if(e.idtipopago is not null && e.monto>0)
                    {
                        var Pago = new PagosPedido();
                        Pago.idpedido = pedido.idpedido;
                        Pago.monto = e.monto;
                        Pago.idtipopago = e.idtipopago;
                        await db.AddAsync(Pago);
                        await db.SaveChangesAsync();
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
