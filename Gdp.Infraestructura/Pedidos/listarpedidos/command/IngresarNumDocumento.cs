using Erp.Persistencia.Modelos;
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
   public class IngresarNumDocumento
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int idpedido { get; set; }
            [Required]
            public string numdocumento { get; set; }
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
                    var pedido = await db.PEDIDO.FindAsync(e.idpedido);
                    //if (pedido.idestado != "EN PROCESO")
                    //    return new mensajeJson("El pedido aún no se encuentra EN PROCESO", null);
                    pedido.numboleta = e.numdocumento;
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
         
        }
    }
}
