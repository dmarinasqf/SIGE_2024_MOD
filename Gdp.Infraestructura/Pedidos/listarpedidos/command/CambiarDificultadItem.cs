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
    public class CambiarDificultadItem
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int iddetalle { get; set; }
            [Required]
            public int iddificultad { get; set; }
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
                    var detalle = db.DETALLEPEDIDO.Find(e.iddetalle);
                    if (detalle is null)
                        return new mensajeJson("No existe el detalle del pedido", null);
                    detalle.iddificultad = e.iddificultad;
                    //detalle.iseditable = false;
                    db.Update(detalle);
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
