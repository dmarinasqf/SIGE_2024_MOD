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

namespace Gdp.Infraestructura.Maestros.OrigenReceta
{
   public class BuscarOrigenReceta
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }          
            public string filtro { get; set; }
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
                PagineModel model = new PagineModel();
                if (e.filtro is null) e.filtro = "a";
                e.filtro = e.filtro.Trim();
                e.pagine = e.pagine ?? new PagineParams();
                var query = await (from o in db.ORIGENRECETA
                             join t in db.TIPORIGENRECETA on o.idtiporigen equals t.idtipo
                             where o.estado != "ELIMINADO" && o.descripcion.Contains(e.filtro)
                             select new
                             {
                                 o.descripcion,
                                 tipo=t.descripcion,
                                 direccion=o.direccion??"",
                                 estado=o.estado,
                                 o.idorigenreceta
                             }).ToListAsync();
               
                model.numregistros = query.Count();
                model.dataobject = query.Skip(e.pagine.tamanopagina * (e.pagine.numpagina - 1)).Take(e.pagine.tamanopagina);
                model.totalpaginas = Convert.ToInt32(Math.Ceiling((double)model.numregistros / e.pagine.tamanopagina));
                model.paginaactual = e.pagine.numpagina;

                return model;

            }
        }
    }
}
