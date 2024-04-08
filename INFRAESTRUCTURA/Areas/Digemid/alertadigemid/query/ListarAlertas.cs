using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Digemid.alertadigemid.query
{
    public class ListarAlertas
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public DateTime fecha { get; set; }
            public PagineParams pagine { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                e.pagine = e.pagine ?? new PagineParams();

                var data = await db.ALERTADIGEMID.Where(x => x.estado == "HABILITADO").Select(x => new
                {
                    x.idalerta,
                    x.nombre,
                    x.archivo,
                    x.descripcion,
                    x.estado,
                    x.fecha,
                    x.fechacreacion
                }).OrderByDescending(x=>x.fechacreacion).ToListAsync();
                var paginacion = new PagineModel();
                var result = data.Skip(e.pagine.tamanopagina * (e.pagine.numpagina - 1)).Take(e.pagine.tamanopagina).ToList();
                paginacion.dataobject = result;
                paginacion.numregistros = result.Count();
                paginacion.totalpaginas = Convert.ToInt32(Math.Ceiling((double)paginacion.numregistros / e.pagine.tamanopagina));
                paginacion.paginaactual = e.pagine.numpagina;
                return paginacion;
              
            }

        }
    }
}
