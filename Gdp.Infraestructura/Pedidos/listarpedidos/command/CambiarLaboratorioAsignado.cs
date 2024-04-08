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
using ENTIDADES.pedidos;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
    public class CambiarLaboratorioAsignado
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public int iddetalle { get; set; }
            [Required]
            public int idlaboratorio { get; set; }
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
                    var detalle = db.DETALLEPEDIDO.Find(e.iddetalle);
                    var cabecera = db.PEDIDO.Find(detalle.idpedido);
                    if (detalle is null)
                        return new mensajeJson("No existe el detalle del pedido", null);
                    
                    if (cabecera.laboratorio is null) cabecera.laboratorio = "0";
                    if (e.idlaboratorio == Convert.ToInt32(cabecera.laboratorio))
                    {
                        var oVerificarExiste = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == detalle.iddetalle && x.estadoproceso == "PENDIENTE").FirstOrDefault();
                        detalle.iddetallepedidoestadoproceso = oVerificarExiste.iddetallepedidoestadoproceso;

                        var lOtrosEstadosDeEseDetalle = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == detalle.iddetalle && x.estadoproceso != "PENDIENTE").ToList();
                        lOtrosEstadosDeEseDetalle.ForEach(x => x.estado = "DESHABILITADO");
                        db.UpdateRange(lOtrosEstadosDeEseDetalle);
                        await db.SaveChangesAsync();
                    }
                    else
                    {
                        var oVerificarExiste = db.DETALLEPEDIDOESTADOPROCESO.Where(x => x.detp_codigo == detalle.iddetalle && x.estadoproceso == "TRANSFERIDO").FirstOrDefault();
                        if (oVerificarExiste is null)
                        {
                            DetallePedidoEstadoProceso oDetallePedidoEstadoProceso = new();
                            oDetallePedidoEstadoProceso.detp_codigo = detalle.iddetalle;
                            oDetallePedidoEstadoProceso.estadoproceso = "TRANSFERIDO";
                            oDetallePedidoEstadoProceso.fecha = DateTime.Now;
                            oDetallePedidoEstadoProceso.estado = "HABILITADO";
                            await db.DETALLEPEDIDOESTADOPROCESO.AddAsync(oDetallePedidoEstadoProceso);
                            await db.SaveChangesAsync();

                            detalle.iddetallepedidoestadoproceso = oDetallePedidoEstadoProceso.iddetallepedidoestadoproceso;
                        }
                        else
                        {
                            oVerificarExiste.estado = "HABILITADO";
                            detalle.iddetallepedidoestadoproceso = oVerificarExiste.iddetallepedidoestadoproceso;
                            db.DETALLEPEDIDOESTADOPROCESO.Update(oVerificarExiste);
                            await db.SaveChangesAsync();
                        }
                    }
                    
                    detalle.idlaboratorio = e.idlaboratorio;
                    detalle.iseditable = false;
                    db.Update(detalle);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", null);

                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
            }
        }
    }
}
