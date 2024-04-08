using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito
{
    public class BuscarCreditoCliente
    {
        public class Ejecutar : IRequest<mensajeJson> {
            public int idcliente { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var cliente =await db.CLIENTE.FindAsync(request.idcliente);
                if (cliente is null)
                    return new mensajeJson("No existe cliente", null);
                var credito =await db.FLINEACREDITO.FindAsync(request.idcliente);
               
                    return new mensajeJson("ok", new {cliente=cliente,linea=credito });                             
            }
        }
    }
}
