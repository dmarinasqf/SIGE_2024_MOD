using ENTIDADES.produccion;
using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.dificultadformula.query
{
   public class ListarDificultad
    {
        public class Ejecutar : IRequest<object>
        {
            public string estado { get; set; }
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
                if (e.estado is null)
                    return await db.DIFICULTADFORMULA.Where(x => x.estado == "HABILITADO").ToListAsync();
                else if(e.estado is "todo")
                    return await db.DIFICULTADFORMULA.Where(x =>x.estado !="ELIMINADO").Select(x => new {
                        iddificultad = x.iddificultad,
                        descripcion = x.descripcion,
                        estado = x.estado
                    }).ToListAsync();
                else
                    return await db.DIFICULTADFORMULA.Where(x => x.estado == e.estado).Select(x=> new   { 
                    iddificultad=x.iddificultad,
                    descripcion=x.descripcion,
                    estado=x.estado
                    }).ToListAsync();

            }
        }
    }
}
