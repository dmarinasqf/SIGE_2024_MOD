using ENTIDADES.finanzas;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito
{
    public class RegistrarEditarCredito
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public FLineaCredito lineacredito { get; set; }
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
                    var obj = request.lineacredito;
                    var existe = await db.FLINEACREDITO.FindAsync(obj.idcliente);
                    if (obj.nuevocredito > 0)
                    {
                        if (!obj.isbloqueado)
                        {
                            db.Add(new FLineaCreditoHistorial
                            {
                                idcliente = obj.idcliente,
                                estado = "HABILITADO",
                                montoactual = obj.nuevocredito,
                                montoingresado = obj.nuevocredito
                            });
                            await db.SaveChangesAsync();

                        }
                    }
                    var montoactualcliente = db.FLINEACREDITOHISTORIAL.Where(x => x.estado == "HABILITADO" && x.idcliente == obj.idcliente).Sum(x => x.montoactual);
                    if (existe is not null)
                    {
                        existe.observacion = obj.observacion;
                        existe.idmoneda = obj.idmoneda;
                        existe.isbloqueado = obj.isbloqueado;
                        existe.idcondicionpago = obj.idcondicionpago;
                        existe.montoactual = montoactualcliente;
                        db.Update(existe);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        obj.montoactual = montoactualcliente;
                        obj.estado = "HABILITADO";
                        db.Add(obj);
                        await db.SaveChangesAsync();
                    }
                    
                    return new mensajeJson("ok", null);
                }
                catch (System.Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }                                
            }
        }
    }
}
