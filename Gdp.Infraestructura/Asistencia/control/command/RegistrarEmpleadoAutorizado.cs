using Erp.Entidades.Asistencia;
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

namespace Gdp.Infraestructura.Asistencia.control.command
{
    public class RegistrarEmpleadoAutorizado
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public AEmpleadosAutorizantes obj { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser  user;
            public Manejador(Modelo db, IUser user)
            {
                this.db = db;
                this.user = user;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    if (e.obj.emp_codigo is > 0)
                    {
                        e.obj.fechaCreado = DateTime.Now;
                        e.obj.usuarioCrea = Convert.ToInt32(user.getIdUserSession());
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);
                    }
                    else
                    {
                        return new mensajeJson("error", null);
                    }
                }
                catch (Exception err)
                {

                    return new mensajeJson(err.Message, null);
                }
            }
        }
    }
}
