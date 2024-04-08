using ENTIDADES.Finanzas;
using Erp.Entidades.delivery;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Delivery.Motorizado.command
{
    public class RegistrarEntregaPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public IFormFile img { get; set; }
            public EntregaDelivery entrega { get; set; }
            public ENTIDADES.delivery.Delivery delivery { get; set; }
            public FPagos pago { get; set; }
            public string ruta { get; set; }

        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;
            public Manejador(Modelo context, IUser _user)
            {
                db = context;
                user = _user;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var obj = db.ENTREGADELIVERY.Find(e.entrega.identregadelivery);
                    string respuesta = "";
                    GuardarElementos elemento = new GuardarElementos();
                    var path = (e.ruta + "/imagenes/pedido/entregapedido/fotoentrega/");
                    if (e.img != null)
                    {
                        string formato = Path.GetExtension(e.img.FileName);
                        var nombreimagen =e. entrega.identregadelivery.ToString() + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + formato;
                        respuesta =  elemento.SaveFile(e.img, path, nombreimagen);
                        if (respuesta is "ok")
                            obj.fotoentrega = nombreimagen;
                    }
                    var deliveryaux = db.DELIVERY.Find(obj.iddelivery);
                    //REALIZAR PAGO SI ES CONTRA ENTREGA
                    if (deliveryaux.estadopago == "PAGO CONTRA ENTREGA" && e.pago.numoperacion != null)
                    {
                        db.FPAGOS.Add(new FPagos
                        {
                            monto = e.pago.monto,
                            estado = "HABILITADO",
                            numoperacion =e. pago.numoperacion,
                            tabla = "PEDIDO-DELIVERY",
                            idtabla = deliveryaux.iddelivery,
                            observacion = "RECEPCION DE PAGO CONTRA ENTREGA POR EL DELIVERY",
                            fecha = DateTime.Now,                           
                        });
                        db.SaveChanges();
                        deliveryaux.estadopago = "PAGADO";
                        db.DELIVERY.Update(deliveryaux);
                        db.SaveChanges();
                    }
                    if (deliveryaux.isencomienda.HasValue && deliveryaux.isencomienda.Value)
                    {
                        deliveryaux.claveagrencia = e.delivery.claveagrencia;
                        deliveryaux.docenvioagencia =e. delivery.docenvioagencia;
                        deliveryaux.usuarioenviaagencia = user.getIdUserSession();
                        db.DELIVERY.Update(deliveryaux);
                        db.SaveChanges();
                    }
                    if (e.entrega.estadoentrega == "ENTREGADO")
                        obj.fechaentregado = DateTime.Now;
                    obj.estadoentrega = e.entrega.estadoentrega;
                    obj.observacion = e.entrega.observacion;
                    obj.fechaentregapedido = e.entrega.fechaentregapedido;
                    db.ENTREGADELIVERY.Update(obj);
                    db.SaveChanges();
                    //cambiar estado de pedido
                    var pedido = db.PEDIDO.Find(deliveryaux.idpedido);
                    pedido.estadoED = e.entrega.estadoentrega;
                    pedido.fechaentregado = DateTime.Now;
                    pedido.usuarioentrega = int.Parse( user.getIdUserSession());
                    db.PEDIDO.Update(pedido);
                    db.SaveChanges();
                    return new mensajeJson("ok", obj);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);

                }
            }

        }
    }
}
