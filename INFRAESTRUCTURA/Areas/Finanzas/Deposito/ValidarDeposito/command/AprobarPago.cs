using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.command
{
    public class AprobarPago
    {
        public class Ejecutar : IRequest<mensajeJson> 
        {
            public int IdPago { get; set; }
            public string Sistema { get; set; }
            public string UsuarioAprueba { get; set; }
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
                        pago.usuarioaprueba = request.UsuarioAprueba;
                        pago.fechaaprobacion = DateTime.Now;
                        if (pago.validado.HasValue && pago.validado.Value)
                            pago.validado = false;
                        else
                            pago.validado = true;
                        db.FPAGOS.Update(pago);
                        await db.SaveChangesAsync();
                    }
                    else if (request.Sistema == "sisqf")
                    {
                        var pago = db.PAGOSPEDIDO.Find(request.IdPago);
                        pago.usuarioaprueba = request.UsuarioAprueba;
                        pago.fechaaprobacion = DateTime.Now;
                        if (pago.validado.HasValue && pago.validado.Value)
                            pago.validado = false;
                        else
                            pago.validado = true;
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
