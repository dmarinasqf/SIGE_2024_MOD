using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.RazaMascota.command
{
    public class RegistrarEditarRaza
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public ENTIDADES.veterinaria.RazaMascota obj{ get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    if (e.obj.idraza is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        db.Update(e.obj);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception error )
                {

                    return new mensajeJson(error.Message, null);
                }
            }
        }
    }
}
