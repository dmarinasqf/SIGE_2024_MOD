
using Erp.Entidades.Generales;
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
    public class RegistrarEditarHorario
    {
        public RegistrarEditarHorario()
        {
        }

        public class Ejecutar : IRequest<mensajeJson>
        {
            public Horario obj { get; set; }
            
            
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
                    if (e.obj.horario_codigo is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);
                    }
                    else
                    {
                        var data = db.HORARIO.Find(e.obj.horario_codigo);
                        data.nmrConsultas = e.obj.nmrConsultas;
                        data.usuariomodifica = user.getIdUserSession().ToString();
                        data.fechaedicion = DateTime.Now;
                        db.Update(data);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);
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
