using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro.command
{
    public class EliminarPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;
            private readonly UserManager<AppUser> Appuser;
            public Manejador(Modelo context, IUser user_, UserManager<AppUser> Appuser_)
            {
                db = context;
                user = user_;
                Appuser = Appuser_;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var pedido = await db.PEDIDO.FindAsync(e.id);
                    bool isadmin = false;
                    var usuario = await Appuser.FindByIdAsync(pedido.usuariocrea);
                    if (usuario is not null)
                        if (await Appuser.IsInRoleAsync(usuario, "ADMINISTRADOR"))
                            isadmin = true;
                    if (pedido.idestado == "PENDIENTE" || isadmin)
                    {
                        pedido.estado = "ELIMINADO";
                        db.Update(pedido);
                        await db.SaveChangesAsync();
                        var detalle = await db.DETALLEPEDIDO.Where(x => x.idpedido == e.id).ToListAsync();
                        detalle.ForEach(x => x.estado = "ELIMINADO");
                        db.UpdateRange(detalle);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);
                    }
                    return new mensajeJson("El pedido N°" + pedido.idpedido.ToString() + " no se puede eliminiar porque esta " + pedido.idestado, null);

                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }

        }
    }
}
