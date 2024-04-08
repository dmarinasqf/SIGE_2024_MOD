using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.VisitaMedica.query
{
    public class ListarEspecialidad
    {
        public class Ejecutar : IRequest<object>
        {
            public string estado { get; set; }
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
                if (e.estado is null || e.estado is "")
                {
                    var data = await db.ESPECIALIDAD.Where(x => x.estado == "HABILITADO").Select(x => new {
                    idEsecialidad=x.esp_codigo,
                    descripcion=x.descripcion,
                    estado=x.estado
                    }).ToListAsync();
                    return data;
                }else if(e.estado is "todo")
                {
                    var data = await db.ESPECIALIDAD.Select(x => new {
                        idEsecialidad = x.esp_codigo,
                        descripcion = x.descripcion,
                        estado = x.estado
                    }).ToListAsync();
                    return data;
                }
                else
                {
                    var data = await db.ESPECIALIDAD.Where(x => x.estado != "ELIMINADO").Select(x => new {
                        idEsecialidad = x.esp_codigo,
                        descripcion = x.descripcion,
                        estado = x.estado
                    }).ToListAsync();
                    return data;
                }
            }
        }
    }
}
