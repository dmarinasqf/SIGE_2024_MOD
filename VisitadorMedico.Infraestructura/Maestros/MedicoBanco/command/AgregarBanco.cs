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

namespace VisitadorMedico.Infraestructura.Maestros.MedicoBanco.command
{
    public class AgregarBanco
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public Erp.Entidades.Generales.MedicoBanco obj { get; set; }
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
                    if (e.obj.cci is null) e.obj.cci = "";
                    if (e.obj.cuenta is null) e.obj.cuenta = "";

                    if (e.obj.iddetalle is 0)
                    {
                        await db.AddAsync(e.obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", null);
                    }
                    else
                    {
                        db.Update(e.obj);
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
