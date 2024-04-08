using ENTIDADES.delivery;
using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.tipoentrega.query
{
    public class ListarTipoEntrega
    {
        public class Ejecutar : IRequest<List<TipoEntrega>>
        {
         
        }
        public class Manejador : IRequestHandler<Ejecutar, List<TipoEntrega>>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<List<TipoEntrega>> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
              
                    return await db.TIPOENTREGA.Where(x => x.estado == "HABILITADO").ToListAsync();
              
            }
        }
    }
}
