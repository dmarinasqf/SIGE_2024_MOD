using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class ListarArchivosPedido
    {
        public class Ejecutar : IRequest<object>
        {
            public int idpedido { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var imagenes =await db.IMAGENPEDIDO.Where(x => x.idpedido == e.idpedido).ToListAsync();
                return imagenes;

            }
        }
    }
}
