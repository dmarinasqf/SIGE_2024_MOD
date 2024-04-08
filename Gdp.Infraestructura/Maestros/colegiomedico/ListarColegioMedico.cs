using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.colegiomedico
{
   public class ListarColegioMedico
    {
        public class Ejecutar : IRequest<object>
        {
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var data = await db.COLEGIOMEDICO.Where(x => x.estado == "HABILITADO").Select(x => new { x.idcolegio, x.descripcion, x.abreviatura }).ToListAsync();
                return data;

            }
        }
    }
}
