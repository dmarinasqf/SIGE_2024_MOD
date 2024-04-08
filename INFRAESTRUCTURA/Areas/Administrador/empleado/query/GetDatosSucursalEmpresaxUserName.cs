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
   public  class GetDatosSucursalEmpresaxUserName
    {
        public class Ejecutar : IRequest<object>
        {
            public string username { get; set; }
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

                var empleado =  db.EMPLEADO.Where(x => x.userName == e.username).ToList().FirstOrDefault();
                if (empleado is null)
                    return new mensajeJson("No existe empleado",null);
                int? idempresa=0;
                if (empleado.suc_codigo is not null)
                    idempresa =  db.SUCURSAL.Find(empleado.suc_codigo).idempresa;

                return new mensajeJson("ok", new
                {
                    idempleado=empleado.emp_codigo,
                    idsucursal=empleado.suc_codigo,
                    idempresa=idempresa
                });



            }

        }
    }
}
