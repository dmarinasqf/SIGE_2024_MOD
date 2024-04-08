using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.tipoOrigenReceta.query
{
    public class ListarTipoOrigenReceta
    {
        public class Ejecutar : IRequest<object>
        {
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                return await db.TIPORIGENRECETA.Select(x => new
                {
                    id = x.idtipo,
                    descripcion = x.descripcion
                }).ToListAsync();
            }
        }
    }
}
