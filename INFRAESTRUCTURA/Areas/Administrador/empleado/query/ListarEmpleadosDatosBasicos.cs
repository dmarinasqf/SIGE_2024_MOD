using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.empleado.query
{
   public class ListarEmpleadosDatosBasicos
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
                var data = await db.EMPLEADO.Where(x => x.estado == null || x.estado == "HABILITADO").Select(x => new
                {
                    idempleado=x.emp_codigo,
                    x.documento,
                    nombres=x.nombres+" "+x.apePaterno+" "+x.apeMaterno
                }).ToListAsync();

                return data;

            }

        }
    }
}
