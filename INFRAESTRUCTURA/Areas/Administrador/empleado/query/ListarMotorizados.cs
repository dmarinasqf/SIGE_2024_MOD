using Erp.Persistencia.Modelos;
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
    public class ListarMotorizados
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
            public async Task<object> Handle(Ejecutar ee, CancellationToken cancellationToken)
            {
                var motorizado1= await db.EMPLEADO.Where(x => (x.perfil_codigo == "MOTORIZADO" || x.perfil_codigo == "JEFE_MOTORIZADO") &&( x.estado == "HABILITADO" || x.estado==null)).Select(x=>new
                {
                    idempleado = x.emp_codigo,
                    nombres = x.nombres + " " + x.apePaterno + " " +x.apeMaterno,
                    x.estado
                }).ToListAsync();

                var motorizados2 =await (from e in db.EMPLEADO
                                   join c in db.CARGOEMLEADO on e.idcargo equals c.idcargo
                                   where (c.idcargo== 1005 || c.idcargo== 1003) && (e.estado=="HABILITADO"||e.estado == null)
                                   select new
                                   {
                                       idempleado=e.emp_codigo,
                                       nombres=e.nombres+" "+e.apePaterno+" "+e.apeMaterno,
                                       e.estado
                                   }
                                   ).ToListAsync();
                motorizado1.AddRange(motorizados2);
                return motorizado1.Distinct().ToList();
            }

        }
    }
}
