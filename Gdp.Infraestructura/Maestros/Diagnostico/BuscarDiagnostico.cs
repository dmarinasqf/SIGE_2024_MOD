using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Diagnostico
{
    public class BuscarDiagnostico
    {
        public class Ejecutar : IRequest<List<ENTIDADES.Generales.Diagnostico>> {
            public string filtro { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, List<ENTIDADES.Generales.Diagnostico>>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<List<ENTIDADES.Generales.Diagnostico>> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.filtro is null) e.filtro = "a";
                var data =await  db.DIAGNOSTICO.Where(x => x.estado == "HABILITADO" && x.descripcion.Contains(e.filtro)).Take(10).ToListAsync();
                return data;

            }
        }
    }
}
