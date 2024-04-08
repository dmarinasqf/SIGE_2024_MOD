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

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
   public class BuscarPedidosDevueltos
    {
        public class Ejecutar : IRequest<mensajeJson>
        {          
            public string idlaboratorio { get; set; }           
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
                    var pedidos = await db.PEDIDO.Where(x => x.estado == "HABILITADO" && x.idestado == "DEVUELTO" && x.laboratorio == e.idlaboratorio).Select(x=>new { 
                        x.idpedido,
                        x.fecha,
                        x.codpedido                    
                    }).ToListAsync();
                    return new mensajeJson("ok", pedidos);

                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }

        }
    }
}
