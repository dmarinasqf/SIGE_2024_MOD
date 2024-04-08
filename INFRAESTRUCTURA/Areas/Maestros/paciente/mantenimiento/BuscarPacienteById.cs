using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento
{
   public class BuscarPacienteById
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int id { get; set; }
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
                var paciente =await  db.PACIENTE.FindAsync(e.id);
                if (paciente is null)
                    return new mensajeJson("No existe paciente", null);
                if (paciente.idtutor != null && paciente.idtutor != 0)
                {
                    var tutor = db.CLIENTE.Find(paciente.idtutor);
                    if (tutor != null)
                        paciente.tutor = tutor.nrodocumento + " " + tutor.descripcion + " " + (tutor.apepaterno ?? "") + " " + tutor.apematerno ?? "";
                }
                    return new mensajeJson("ok", paciente);

            }
        }
    }
}
