using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
    public class CambiarEstadoDetalleTerminado
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int iddetalle { get; set; }
            public bool estadoTerminado { get; set; }
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
                try
                {
                    var oDetalle = db.DETALLEPEDIDO.Where(x => x.iddetalle == e.iddetalle).FirstOrDefault();
                    var oVerificarRegistro = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == e.iddetalle && x.estadoproceso == "TERMINADO").FirstOrDefault();
                    if (e.estadoTerminado)
                    { 
                        if (oVerificarRegistro is null)
                        {
                            DetallePedidoEstadoProceso oDetallePedidoEstadoProceso = new();
                            oDetallePedidoEstadoProceso.detp_codigo = e.iddetalle;
                            oDetallePedidoEstadoProceso.estadoproceso = "TERMINADO";
                            oDetallePedidoEstadoProceso.fecha = DateTime.Now;
                            oDetallePedidoEstadoProceso.estado = "HABILITADO";
                            await db.DETALLEPEDIDOESTADOPROCESO.AddAsync(oDetallePedidoEstadoProceso);
                            await db.SaveChangesAsync();

                            oDetalle.iddetallepedidoestadoproceso = oDetallePedidoEstadoProceso.iddetallepedidoestadoproceso;
                        }
                        else
                        {
                            oVerificarRegistro.estado = "HABILITADO";
                            oVerificarRegistro.fecha = DateTime.Now;
                            db.DETALLEPEDIDOESTADOPROCESO.Update(oVerificarRegistro);
                            await db.SaveChangesAsync();

                            oDetalle.iddetallepedidoestadoproceso = oVerificarRegistro.iddetallepedidoestadoproceso;
                        }
                    }
                    else
                    {
                        oVerificarRegistro.estado = "DESHABILITADO";
                        db.DETALLEPEDIDOESTADOPROCESO.Update(oVerificarRegistro);
                        await db.SaveChangesAsync();

                        var oEstadoProcesoPendiente = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == e.iddetalle && x.estadoproceso == "PENDIENTE").FirstOrDefault();
                        oDetalle.iddetallepedidoestadoproceso = oEstadoProcesoPendiente.iddetallepedidoestadoproceso;
                    }
                    oDetalle.iseditable = false;
                    db.DETALLEPEDIDO.Update(oDetalle);
                    await db.SaveChangesAsync();

                    return new mensajeJson("ok", oDetalle);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }
        }
    }
}
