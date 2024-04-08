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
    public class GetSucursalesEmpleado
    {
        public class Ejecutar : IRequest<object>
        {
            public int idempleado { get; set; }
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
                var data = await (from us in db.EMPLEADOSUCURSAL
                                  join s in db.SUCURSAL on us.idsucursal equals s.suc_codigo
                                  where us.idempleado == e.idempleado
                                  orderby s.descripcion
                                  select new
                                  {
                                      idsucursal = s.suc_codigo,
                                      s.descripcion
                                  }).ToListAsync();
                return data;

            }

        }
    }
}
