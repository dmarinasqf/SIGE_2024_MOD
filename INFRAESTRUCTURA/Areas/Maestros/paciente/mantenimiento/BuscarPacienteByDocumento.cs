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

namespace Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento
{
    public class BuscarPacienteByDocumento
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string numdocumento { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;

            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.numdocumento is null) e.numdocumento = "";
                e.numdocumento = e.numdocumento.Trim();
                var paciente = await db.PACIENTE.Where(x => x.estado != "ELIMINADO" && x.numdocumento == e.numdocumento || (x.nombres + " " + x.apepaterno + " " + x.apematerno).Contains(e.numdocumento)).FirstOrDefaultAsync();
                if (paciente is null)
                    return new mensajeJson("No existe paciente", null);
                else
                    return new mensajeJson("ok", new
                    {
                        paciente.idpaciente,
                        paciente.nombres,
                        apepaterno = paciente.apepaterno ?? "",
                        apematerno = paciente.apematerno ?? "",
                        paciente.numdocumento
                    });

            }
        }
    }
}