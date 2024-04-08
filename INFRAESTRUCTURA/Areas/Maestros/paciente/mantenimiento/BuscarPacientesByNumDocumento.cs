using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento
{
  public   class BuscarPacientesByNumDocumento
    {
        public class Ejecutar : IRequest<object>
        {
            public string numdocumento { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.numdocumento is null) e.numdocumento = "";
                e.numdocumento = e.numdocumento.Trim();
                var pacientes = await db.PACIENTE.Where(x => x.estado == "HABILITADO" && (x.numdocumento.Contains(e.numdocumento)
                 || (x.nombres + ' ' + x.apepaterno + ' ' + x.apematerno).Contains(e.numdocumento)))
                    .Select(x=> new {
                        x.idpaciente,
                        x.nombres,
                        apepaterno = x.apepaterno ?? "",
                        apematerno = x.apematerno ?? "",
                        x.numdocumento
                    }).Take(10).ToListAsync();

                return pacientes;
              

            }
        }
    }
}
