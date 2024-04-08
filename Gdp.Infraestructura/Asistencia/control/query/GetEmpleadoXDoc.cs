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
using Newtonsoft.Json;

namespace Gdp.Infraestructura.Asistencia.control.query
{
    public class GetEmpleadoXDoc
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string doc { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {

                var data = await (from ee in db.EMPLEADO join S in db.SUCURSAL on ee.suc_codigo equals S.suc_codigo
                                  where ee.documento == e.doc select new {
                                  descripcionS=S.descripcion,
                                  ee.emp_codigo,
                                  ee.nombres,
                                  ee.apePaterno,
                                  ee.apeMaterno

                                  }).ToListAsync();
                if (data.Count is 0)
                {
                    return (new mensajeJson("no encontrado", null));
                }
                else
                {
                    return new mensajeJson("encontrado", data);
                }

            }

            
        }
    }
}
