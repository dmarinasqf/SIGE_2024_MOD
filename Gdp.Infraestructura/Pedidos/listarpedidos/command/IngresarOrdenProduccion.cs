using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
    public class IngresarOrdenProduccion
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int idpedido { get; set; }
            [Required]
            public string orden { get; set; }
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
                    if (!await VerificarDificultadDetalleAsync(e.idpedido))
                        return new mensajeJson("Ingrese la dificultad de la formula para todos los items", null);
                    pedido.idestado = "EN PROCESO";
                    if(pedido.fechaproduccion is null)
                        pedido.fechaproduccion = DateTime.Now;
                    pedido.usuariolaboratorio =int.Parse( user.getIdUserSession());
                    pedido.ordenproduccion = e.orden;
                    pedido.iseditable = false;
                    db.Update(pedido);
                    await db.SaveChangesAsync();                    
                    return new mensajeJson("ok", null);

                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }
            private async Task<bool> VerificarDificultadDetalleAsync(int idpedido)
            {

                var detalle =await db.DETALLEPEDIDO.Where(x => x.idpedido == idpedido && x.tipoitem=="FM" && x.estado== "HABILITADO").ToListAsync();
                var c = 0;
                foreach (var item in detalle)
                {
                    if (item.iddificultad is not null)
                        c++;

                }
                if (detalle.Count == c)
                    return true;
                else
                    return false;
            }

        }
    }
}
