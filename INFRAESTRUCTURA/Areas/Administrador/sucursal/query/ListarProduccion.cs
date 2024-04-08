using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.sucursal.query
{
    public class ListarProduccion
    {
        public class Ejecutar : IRequest<object>
        {}
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var data = db.SUCURSAL.Where(x => x.tipoSucursal == "PRODUCCIÓN" && x.estado == "HABILITADO")
                                  .OrderBy(x => x.descripcion).ToListAsync();
                return data;
            }
        }
    }
}
