using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
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
    public class CambiarEstadoProcesoDetalle
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int iddetalle { get; set; }
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
                    var detalle = db.DETALLEPEDIDO.Where(x => x.iddetalle == e.iddetalle).FirstOrDefault();
                    var detalleEstadoProceso = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == detalle.iddetalle && x.estado == "HABILITADO").OrderByDescending(x => x .fecha).FirstOrDefault();
                    var nuevoEstadoProceso = "";
                    if (detalleEstadoProceso.estadoproceso == "TRANSFERIDO")
                        nuevoEstadoProceso = "EN CURSO";
                    else if (detalleEstadoProceso.estadoproceso == "EN CURSO")
                        nuevoEstadoProceso = "TERMINADO";
                    else if (detalleEstadoProceso.estadoproceso == "TERMINADO")
                        nuevoEstadoProceso = "EN CAMINO";
                    else if (detalleEstadoProceso.estadoproceso == "EN CAMINO")
                        nuevoEstadoProceso = "RECEPCIONADO";

                    DetallePedidoEstadoProceso oEstadoProcesoReturn = new();
                    var oValidarEstado = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == detalle.iddetalle && x.estadoproceso == nuevoEstadoProceso).FirstOrDefault();
                    if (oValidarEstado is null)
                    {
                        DetallePedidoEstadoProceso oDetallePedidoEstadoProceso = new();
                        oDetallePedidoEstadoProceso.detp_codigo = detalle.iddetalle;
                        oDetallePedidoEstadoProceso.estadoproceso = nuevoEstadoProceso;
                        oDetallePedidoEstadoProceso.fecha = DateTime.Now;
                        oDetallePedidoEstadoProceso.estado = "HABILITADO";
                        await db.DETALLEPEDIDOESTADOPROCESO.AddAsync(oDetallePedidoEstadoProceso);
                        await db.SaveChangesAsync();

                        detalle.iddetallepedidoestadoproceso = oDetallePedidoEstadoProceso.iddetallepedidoestadoproceso;
                        oEstadoProcesoReturn = oDetallePedidoEstadoProceso;
                    }
                    else
                    {
                        oValidarEstado.estado = "HABILITADO";
                        db.Update(oValidarEstado);
                        await db.SaveChangesAsync();
                        detalle.iddetallepedidoestadoproceso = oValidarEstado.iddetallepedidoestadoproceso;

                        oEstadoProcesoReturn = oValidarEstado;
                    }

                    db.Update(detalle);
                    await db.SaveChangesAsync();
                    
                    return new mensajeJson("ok", oEstadoProcesoReturn);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }
        }
    }
}
