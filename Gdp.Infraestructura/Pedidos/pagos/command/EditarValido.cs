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

namespace Gdp.Infraestructura.Pedidos.pagos.command
{
    public class EditarValido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int id { get; set; }

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
                    var data = db.FPAGOS.Find(e.id);
                    if (data is not null)
                    {
                        if (data.validado is null)
                        {
                            data.validado = true;
                            data.usuarioaprueba = user.getIdUserSession();
                            data.fechaaprobacion = DateTime.Now;
                            db.Update(data);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", null);
                        }else if (data.validado is true)
                        {
                            data.validado = false;
                            db.Update(data);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", null);
                        }
                        else
                        {
                            data.validado = true;
                            data.usuarioaprueba = user.getIdUserSession();
                            //data.usuariomodifica = user.getIdUserSession();
                            data.fechaaprobacion = DateTime.Now;
                            db.Update(data);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", null);
                        }
                    }
                    else
                    {
                        return new mensajeJson("no " + (e.id).ToString(), "aaaaaaaa");

                    }
                }
                catch (Exception error)
                {
                    return new mensajeJson("ok", error.Message);
                }
            }
        }
    }
}
