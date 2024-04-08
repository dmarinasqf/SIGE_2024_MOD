using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Digemid.alertadigemid.query
{
    public class BuscarAlerta
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var data= await db.ALERTADIGEMID.FindAsync(e.id);
                if (data is null)
                    return new mensajeJson("No existe alerta", null);
                return new mensajeJson("ok", data);
            }
        }
    }
}
