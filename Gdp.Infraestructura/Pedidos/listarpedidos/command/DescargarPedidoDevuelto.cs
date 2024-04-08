using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
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

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
   public  class DescargarPedidoDevuelto
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public int idquimico { get; set; }
            
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly UserManager<AppUser> usermanager;
            public Manejador(Modelo context, UserManager<AppUser> usermanager_)
            {
                db = context;
                usermanager = usermanager_;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var usuario = await usermanager.FindByIdAsync(e.idquimico.ToString());
                    if (usuario is null)
                        return new mensajeJson("El empleado ingresado, no existe", null);
                    if (!(await usermanager.IsInRoleAsync(usuario,"LABORATORIO")) && !(await usermanager.IsInRoleAsync(usuario, "QUIMICO_FARMACEUTICO")) && !(await usermanager.IsInRoleAsync(usuario,"ADMINISTRADOR")))
                        return new mensajeJson("No cuenta con los permisos para realizar la operación", null);
                        

                    var obj =await db.PEDIDO.FindAsync(e.idpedido);
                    if (obj.idestado != "DEVUELTO")
                        return new mensajeJson("El pedido no esta devuelto", null);
                    obj.idestado = "DESCARGADO";
                    db.Update(obj);
                    await db.SaveChangesAsync();

                    var devolucion = db.DEVOLUCIONPEDIDO.Where(x => x.idpedido == e.idpedido).FirstOrDefault();
                    if (devolucion != null)
                    {
                        devolucion.fechaaceptacion = DateTime.Now;
                        devolucion.quimicoacepta = e.idquimico;
                        db.Update(devolucion);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok",null);
                    }
                    else
                        return new mensajeJson("El pedido aun no ha sido devuelto",null);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }

            }

        }
    }
}
