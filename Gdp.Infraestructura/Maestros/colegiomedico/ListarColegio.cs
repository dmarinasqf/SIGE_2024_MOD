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

namespace Gdp.Infraestructura.Maestros.colegiomedico.NewFolder
{
    public class ListarColegio
    {
        public class Ejecutar : IRequest<object>
        {
            public string tipo { get; set; }
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
                if (e.tipo is null || e.tipo is "")
                {
                    var data = await db.COLEGIOMEDICO.Where(x => x.estado == "HABILITADO").Select(x => new
                    {
                        x.idcolegio,
                        x.abreviatura,
                        x.descripcion,
                        x.nmrdigitos,
                        x.estado
                    }).ToListAsync();
                    return data;
                }
                else if (e.tipo is "todo")
                {
                    var data = await db.COLEGIOMEDICO.Where(x => x.estado != "ELIMINADO").Select(x => new
                    {
                        x.idcolegio,
                        x.abreviatura,
                        x.descripcion,
                        x.nmrdigitos,
                        x.estado
                    }).ToListAsync();
                    return data;
                }
                else
                {
                    var data = await db.COLEGIOMEDICO.Where(x => x.estado == "HABILITADO").Select(x => new
                    {
                        x.idcolegio,
                        x.abreviatura,
                        x.descripcion,
                        x.nmrdigitos,
                        x.estado
                    }).ToListAsync();
                    return data;
                }
            }
        }
    }
}
