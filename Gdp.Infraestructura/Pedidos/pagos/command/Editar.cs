using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.pagos.command
{
    public class Editar
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpago { get; set; }
            public String observacion { get; set; }
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
                    //var id = 100;
                    var data = db.FPAGOS.Find(e.idpago);
                    if (data is not null)
                    {
                            data.observacion = e.observacion;
                            data.usuariomodifica = user.getIdUserSession();
                            data.fechaedicion = DateTime.Now;
                        db.Update(data);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", e.observacion);
                    }
                    else
                    {
                        return new mensajeJson("pago no existe", e.observacion);
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
