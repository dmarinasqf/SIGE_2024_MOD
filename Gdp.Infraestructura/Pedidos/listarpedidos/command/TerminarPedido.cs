using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
   public class TerminarPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int idpedido { get; set; }
            [Required]
            public int   idformulador { get; set; }
            public string usuarioactual { get; set; }
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
                    var pedido = await db.PEDIDO.FindAsync(e.idpedido);
                    if (pedido.numboleta is null || pedido.numboleta is "")
                        return new mensajeJson("Ingrese número de documento", null);
                    pedido.idestado = "TERMINADO";
                    pedido.fechafin = DateTime.Now;
                    if (e.usuarioactual is "usuarioactual" )
                        pedido.usuarioformulador =int.Parse( user.getIdUserSession());
                    else
                         pedido.usuarioformulador = e.idformulador;
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
