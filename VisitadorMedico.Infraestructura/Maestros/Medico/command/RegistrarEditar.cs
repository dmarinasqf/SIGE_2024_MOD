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

namespace VisitadorMedico.Infraestructura.Maestros.Medico.command
{
    public class RegistrarEditar
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public ENTIDADES.Generales.Medico obj { get; set; }
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
                    if (e.obj.idmedico is 0)
                    {
                        var data = db.MEDICO.Where(x => x.nrocolegiatura == e.obj.nrocolegiatura && x.estado == "HABILITADO").FirstOrDefault();
                        if (data != null)
                        {
                            return new mensajeJson("El número de colegiatura ingresado existe.", null);
                        }
                        else
                        {
                            await db.AddAsync(e.obj);
                            await db.SaveChangesAsync();
                            var dataInt = db.MEDICO.Where(x => x.nrocolegiatura == e.obj.nrocolegiatura)//&& x.usuariocrea==user.getIdUserSession().ToString()
                                .Select(x => new { x.idmedico }).ToList();
                            return new mensajeJson("ok", dataInt);
                        }
                    }
                    else
                    {
                        var data = db.MEDICO.Where(x => x.nrocolegiatura == e.obj.nrocolegiatura && x.idmedico != e.obj.idmedico && x.estado == "HABILITADO").FirstOrDefault();
                        if (data != null)
                        {
                            return new mensajeJson("El número de colegiatura ingresado existe.", null);
                        }
                        else
                        {
                            db.Update(e.obj);
                            db.SaveChanges();
                            var dataInt = db.MEDICO.Where(x => x.nrocolegiatura == e.obj.nrocolegiatura)//&& x.usuariocrea == user.getIdUserSession().ToString()
                               .Select(x => new { x.idmedico }).ToList();
                            return new mensajeJson("ok", dataInt);
                        }
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
