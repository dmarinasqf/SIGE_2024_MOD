using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Asistencia.control.command
{
    public class EnviarEmail
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string email { get; set; }
            public string htmlbody { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            public Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
