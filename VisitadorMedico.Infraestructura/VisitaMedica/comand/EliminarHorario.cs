using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.VisitaMedica.comand
{
    public class EliminarHorario
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int cod { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;

            public Manejador(Modelo db, IUser user)
            {
                this.db = db;
                this.user = user;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var data = db.HORARIO.Find(e.cod);
                    if (data is not null)
                    {
                        data.estado = "ELIMINADO";
                        data.usuariomodifica = user.getIdUserSession().ToString();
                        data.fechaedicion = DateTime.Now;
                        db.Update(data);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", data);
                    }
                    else
                    {
                        return new mensajeJson("null", null);
                    }
                }
                catch (Exception error)
                {
                    return new mensajeJson(error.Message, null);
                }
            }
        }
    }
}
