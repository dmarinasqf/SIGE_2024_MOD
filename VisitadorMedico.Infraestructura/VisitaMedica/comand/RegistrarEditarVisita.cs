using Erp.Entidades.visitadormedico;
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
    public class RegistrarEditarVisita
    {
        public class Ejecutar : IRequest<object>
        {
            public HorarioVisitaMedica horario { get; set; }
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
                var horario = e.horario;
                try
                {
                    if (horario.hvm_codigo is 0)
                    {
                        horario.usuarioCreo = user.getIdUserSession().ToString();
                        horario.usuarioModifica = "";
                        horario.fechaCreado = DateTime.Now;
                        horario.fechaModificacion = DateTime.Now;
                        if (!horario.condicionregistro)
                        {
                            horario.detallenovisita = "";
                            horario.descripcion = "";
                            horario.visita = null;
                            horario.estadovisita = "";
                            horario.observacion = "";
                        }
                        await db.HORARIOVISITAMEDICA.AddAsync(horario);
                        await db.SaveChangesAsync();
                        return new { mensaje = "ok" };

                    }else
                    {
                       var horariocreado = db.HORARIOVISITAMEDICA.Find(horario.hvm_codigo);
                        if (horariocreado != null)
                        {
                            horario.usuarioCreo = horariocreado.usuarioCreo;
                            horario.fechaCreado = horariocreado.fechaCreado;
                        }
                        horario.usuarioModifica = user.getIdUserSession().ToString();
                        horario.fechaModificacion = DateTime.Now;

                        db.Update(horario);
                        await db.SaveChangesAsync();
                        return new { mensaje = "ok" };
                    }
                }
                catch (Exception err)
                {
                    return new { mensaje = err.Message };
                }
            }
        }
    }
}
