using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.VisitaMedica.comand
{
   public class EliminarVisita
    {
        public class Ejecutar : IRequest<object>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            private readonly IUser user;
            public Manejador(Modelo context, IUser user_)
            {
                db = context;
                user = user_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                
                try
                {
                    
                    var horario = db.HORARIOVISITAMEDICA.Find(e.id);                  
                    if (horario is not null)
                    {
                        horario.usuarioModifica = user.getIdUserSession().ToString();
                        horario.fechaModificacion = DateTime.Now;
                        horario.estado = "ELIMINADO";
                        db.Update(horario);
                        await db.SaveChangesAsync();
                    }
                    return new { mensaje = "ok" };
                }
                catch (Exception err)
                {
                    return new { mensaje = err.Message };
                }
            }
        }
    }
}
