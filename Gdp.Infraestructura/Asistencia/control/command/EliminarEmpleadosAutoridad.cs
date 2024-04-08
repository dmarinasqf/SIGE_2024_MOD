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
using static Gdp.Infraestructura.Asistencia.control.command.EliminarEmpleadosAutoridad;

namespace Gdp.Infraestructura.Asistencia.control.command
{
    public class EliminarEmpleadosAutoridad
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int codigo { get; set; }
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

            public async Task<mensajeJson> Handle(EliminarEmpleadosAutoridad.Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var data = db.ASISEMPLEADOSAUTORIZANTES.Find(e.codigo);
                    if (data is null)
                    {
                        return new mensajeJson("no existe: " + (e.codigo).ToString(), null);
                    }
                    else
                    {
                        data.usuarioModifica = Convert.ToInt32(user.getIdUserSession());
                        data.fechaModifica = DateTime.Now;
                        data.estado = "ELIMINADO";
                        db.Update(data);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);                        
                    }

                }
                catch (Exception)
                {

                    throw;
                }
            }
        }
    }
}
