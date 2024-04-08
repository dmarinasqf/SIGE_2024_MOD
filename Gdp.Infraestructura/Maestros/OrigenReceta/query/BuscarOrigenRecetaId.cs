using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.OrigenReceta.query
{
    public class BuscarOrigenRecetaId
    {
        public class Ejecutar : IRequest<object>
        {
            public int codigo { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.codigo > 0)
                {
                    var query = await db.ORIGENRECETA.Where(x => x.idorigenreceta == e.codigo).Select(x => new {
                        id = x.idorigenreceta,
                        descripcion = x.descripcion,
                        direccion = x.direccion,
                        dpto = x.iddepartamento,
                        provincia = x.idprovincia,
                        distrito = x.iddistrito,
                        to = x.idtiporigen,
                        estado = x.estado
                    }).ToListAsync();
                    return query;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
