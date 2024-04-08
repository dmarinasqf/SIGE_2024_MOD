using ENTIDADES.Finanzas;
using ENTIDADES.pedidos;
using Erp.Entidades.pedidos;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.Registro
{
    public class RegistrarPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public Pedido pedido { get; set; }
          
            public ENTIDADES.delivery.Delivery delivery { get; set; }
            public List<PagosPedido> pagos { get; set; }
            public string ruta { get; set; }
            public int idaperturacaja { get; set; }//EARTCOD1011
            public int idtipotarjeta { get; set; }//EARTCOD1011
            public decimal? pkdescuento { get; set; }//EARTCOD1009
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;

            public Manejador(Modelo context, IUser user_)
            {
                db = context;
                user = user_;

            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var pedido = e.pedido;
           
                var detalle = JsonConvert.DeserializeObject<List<DetallePedido>>(e.pedido.jsondetalle);

                int iddistribuciongenerado = 0;
                using (var transaction = await db.Database.BeginTransactionAsync())
                {
                    
                    try
                    {
                        pedido.fecha = DateTime.Now;
                        //var countProductosPT = detalle.Where(x => x.tipoitem == "PT").Count();
                        //if (countProductosPT == detalle.Count())
                        //    pedido.idestado = "TERMINADO";
                        //else
                        pedido.idestado = "PENDIENTE";

                        pedido.estado = "HABILITADO";
                        pedido.idempleado = int.Parse(user.getIdUserSession());
                        pedido.codpedido = GenerarCodigoPedido(pedido.sucursalfactura.Value);
                        pedido.total = (double)detalle.Sum(x => x.subtotal);
                        pedido.pkdescuento = e.pkdescuento; //EARTCOD1009

                        if ((pedido.adelanto ?? 0) > 0)
                            pedido.saldo = pedido.total.Value - pedido.adelanto ?? 0;
                        if (pedido.descuento)
                        {
                            pedido.total = 0;
                            pedido.adelanto = 0;
                            pedido.saldo = 0;
                            detalle.ForEach(x => x.subtotal = 0);
                            detalle.ForEach(x => x.precio = 0);
                        }
                        pedido.sucursalregistra = user.getIdSucursalCookie();
                        if (verificarsidetalleesPT(detalle))
                            pedido.laboratorio = null;
                        await db.AddAsync(pedido);
                        await db.SaveChangesAsync();
                        foreach (var detallePedido in detalle)
                        {
                            if (detallePedido.idpromopack.HasValue)
                            {
                                DetallePackPedidoVenta detallePackPedidoVenta = new();
                                int idpromopack = detallePedido.idpromopack.Value;
                                int pedidocodigo = pedido.idpedido;
                                var idpackventapedido = db.DETALLEPACKPEDIDOVENTA.Where(pp => pp.idpromopack == idpromopack && pp.idpedido_codigo == pedidocodigo).Select(pp => pp.idpackPedidoVenta).FirstOrDefault();
                                if(idpackventapedido == null)
                                {
                                    var precio = db.PRECIOSPRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.precio).FirstOrDefault();
                                    var precioSindescuento = db.PRECIOSPRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.precioSindescuento).FirstOrDefault();
                                    var cantidadDescuento = db.PRECIOSPRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.cantidadDescuento).FirstOrDefault();
                                    var porcentajedescuento = db.PRECIOSPRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.porcentajedescuento).FirstOrDefault();
                                    var nombrepack = db.APRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.nombre).FirstOrDefault();
                                    var Codigopack = db.APRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.codigoproducto).FirstOrDefault();
                                    var idtipotributo = db.APRODUCTO.Where(pp => pp.idproducto == idpromopack).Select(pp => pp.idtipotributo).FirstOrDefault();

                                    detallePackPedidoVenta.idpedido_codigo = pedidocodigo; 
                                    detallePackPedidoVenta.precioproductopack = precio ?? 0;
                                    detallePackPedidoVenta.precioTotalPacks = precio * detallePedido.cantidadPacks.Value ?? 0; 
                                    detallePackPedidoVenta.cantidadPacks = detallePedido.cantidadPacks.Value; 
                                    detallePackPedidoVenta.idpromopack = idpromopack; 
                                    detallePackPedidoVenta.fechacreacion = DateTime.Now.AddMonths(1);
                                    detallePackPedidoVenta.precioSindescuento = precioSindescuento ?? 0; 
                                    detallePackPedidoVenta.cantidadDescuento = cantidadDescuento ?? 0; 
                                    detallePackPedidoVenta.porcentajedescuento = porcentajedescuento ?? 0; 
                                    detallePackPedidoVenta.precioIgvpack = Math.Round(Convert.ToDecimal(precio) / 1.18m, 2);
                                    detallePackPedidoVenta.Nombredepack = nombrepack ?? ""; 
                                    detallePackPedidoVenta.Codigopack = Codigopack ?? ""; 
                                    detallePackPedidoVenta.idtipotributo = idtipotributo ?? "";                                   
                                    db.DETALLEPACKPEDIDOVENTA.Add(detallePackPedidoVenta);
                                    await db.SaveChangesAsync();
                                    iddistribuciongenerado = (int)detallePackPedidoVenta.idpackPedidoVenta;

                                    detallePedido.idpackPedidoVenta = iddistribuciongenerado;
                                }
                                else
                                {
                                    detallePedido.idpackPedidoVenta = idpackventapedido;
                                }

                            }                          
                        }
                        detalle.ForEach(x => x.estado = "HABILITADO");
                        detalle.ForEach(x => x.idpedido = pedido.idpedido);
                        await db.AddRangeAsync(detalle);
                        await db.SaveChangesAsync();

                        //EARTCOD1011 -TABLA PARA ASOCIAR PEDIDO CON CAJA APERTURA -
                        //var pedidoCaja = new PedidoCaja();
                        //pedidoCaja.idpedido = pedido.idpedido;
                        //pedidoCaja.idaperturacaja = Convert.ToInt32(e.idaperturacaja);
                        //pedidoCaja.idtipotarjeta = e.idtipotarjeta;
                        //await db.AddAsync(pedidoCaja);
                        //await db.SaveChangesAsync();
                        //-EARTCOD1011

                        //registrar datos delivery
                        if (e.delivery is not null)
                        {
                            e.delivery.idpedido = pedido.idpedido;
                            var res = await RegistrarDeliveryAsync(e.delivery, e.pedido);
                            if (res != "ok")
                            {
                                await transaction.RollbackAsync();
                                return new mensajeJson("Error al registrar delivery " + res, null);
                            }
                        }
                        if (e.pagos is not null && e.pagos.Count > 0)
                        {
                            e.pagos.ForEach(x => x.idpedido = pedido.idpedido);
                            e.pagos.ForEach(x => x.idsucursal = pedido.sucursalregistra);
                            var res = await RegistrarPagos(e.pagos, e.ruta);
                            if (res != "ok")
                            {
                                await transaction.RollbackAsync();
                                return new mensajeJson("Error al registrar depositos del pedidos " + res, null);
                            }
                        }
                        //registrar datos de pago

                        await transaction.CommitAsync();
                        return new mensajeJson("ok", pedido);
                    }
                    catch (Exception err)
                    {
                        await transaction.RollbackAsync();
                        return new mensajeJson(err.Message, null);
                    }
                }
            }

            private async Task<string> RegistrarPagos(List<PagosPedido> pagos, string ruta)
            {
                try
                {
                    GuardarElementos elemento = new GuardarElementos();
                    for (int i = 0; i < pagos.ToList().Count; i++)
                    {
                        pagos[i].estado = "HABILITADO";
                        if (pagos[i].imagen is not null)
                        {
                            var nombreimagen = "sisqf_" + pagos[i].idpedido.ToString() + "_" + i + "_" + DateTime.Now.ToString("yyyyMMddHHmm");
                            var respuesta = await elemento.SaveFileBase64(pagos[i].imagen, ruta + "/imagenes/pedido/depositos/", nombreimagen);
                            if (respuesta is not "x")
                                pagos[i].imagen = nombreimagen;
                        }
                    }

                    await db.AddRangeAsync(pagos);
                    await db.SaveChangesAsync();
                    return "ok";
                }
                catch (Exception e)
                {

                    return e.Message;
                }
            }

            private async Task<string> RegistrarDeliveryAsync(ENTIDADES.delivery.Delivery obj, Pedido pedido)
            {
                try
                {
                    obj.idsucursal = pedido.sucursalfactura;
                    var tipoentrega = await db.TIPOENTREGA.FindAsync(obj.idtipoentrega);
                    obj.tipoentrega = tipoentrega.descripcion;
                    await db.AddAsync(obj);
                    await db.SaveChangesAsync();

                    return "ok";
                }
                catch (Exception e)
                {

                    return e.Message;
                }

            }
            private string GenerarCodigoPedido(int idsucursal)
            {

                int ano = DateTime.Now.Year;
                var numpedido = db.PEDIDO.Where(x => x.sucursalfactura == idsucursal && x.fecha.Value.Date.Year == ano).Count();
                numpedido++;
                var correlativo = idsucursal.ToString() + (ano).ToString().Substring(2, 2) + "0" + numpedido.ToString();
                return correlativo;
            }
            private bool verificarsidetalleesPT(List<DetallePedido> detalle)
            {
                bool res = true;
                foreach (var item in detalle)
                {
                    if (item.tipoitem == "FM")
                    {
                        res = false;
                        break;
                    }
                }
                return res;
            }

        }
    }
}
