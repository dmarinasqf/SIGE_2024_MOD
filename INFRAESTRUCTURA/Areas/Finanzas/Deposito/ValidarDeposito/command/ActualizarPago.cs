using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.command
{
    public class ActualizarPago
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int IdPago { get; set; }
            public string Sistema { get; set; }
            public string Observacion { get; set; }
            public string NumOperacion { get; set; }
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
                try
                {
                    if (request.Sistema == "gdp")
                    {
                        var pago = db.FPAGOS.Find(request.IdPago);
                        pago.numoperacion = request.NumOperacion;
                        pago.observacion = request.Observacion;
                        db.FPAGOS.Update(pago);
                        await db.SaveChangesAsync();
                    }
                    else if (request.Sistema == "sisqf")
                    {
                        var pago = db.PAGOSPEDIDO.Find(request.IdPago);
                        pago.numoperacion = request.NumOperacion;
                        pago.observacion = request.Observacion;
                        db.Update(pago);
                        await db.SaveChangesAsync();

                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception ex)
                {
                    return new mensajeJson(ex.Message, null);
                }
            }
        }
    }
}
