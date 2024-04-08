using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.especialidad.NewFolder
{
    public class RegistrarEditarEspecialidad
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public EspecialidadMedico obj { get; set; }
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
                    if (e.obj.esp_codigo is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        db.Update(e.obj);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok", e.obj);
                }
                catch (Exception error)
                {

                    return new mensajeJson(error.Message, null);
                }
            }
        }
    }
}
