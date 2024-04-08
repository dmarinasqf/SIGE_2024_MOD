using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.estadopedido
{
  public  class ListarEstado
    {
        public class Ejecutar : IRequest<List<EstadoPedido>>
        {
            public string tipo { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, List<EstadoPedido>>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<List<EstadoPedido>> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.tipo is null)
                    return await db.ESTADOPEDIDO.Where(x => x.estado == "HABILITADO").ToListAsync();
                else
                    return await db.ESTADOPEDIDO.Where(x => x.estado == "HABILITADO" && x.tipo == e.tipo).ToListAsync();

            }
        }
    }
}
