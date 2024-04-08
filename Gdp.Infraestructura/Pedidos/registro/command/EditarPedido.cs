using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.registro.command
{
   public class EditarPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public int? idcliente { get; set; }
            public int? idpaciente { get; set; }
            public int? idmedico { get; set; }
            public int? iddelivery { get; set; }//EARTCOD1005
            public string? direcciondeenvio { get; set; }//EARTCOD1005
            public int? idorigenreceta { get; set; }
            public string? idusuario { get; set; }
            public List<string >jsondetalle { get; set; }
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
                using (var transaccion=await  db.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var pedido = await db.PEDIDO.FindAsync(e.idpedido);
                        if (pedido is null)
                            return new mensajeJson("No existe el pedido", null);
                        //if (pedido.idestado != "PENDIENTE")
                        //    return new mensajeJson("No se puede editar el pedido porque esta " + pedido.idestado, null);

                      
                        var detalle = await db.DETALLEPEDIDO.Where(x => x.idpedido == e.idpedido).ToListAsync();
                        detalle.ForEach(x => x.estado = "ELIMINADO");
                        foreach (var item in e.jsondetalle)
                        {
                            var data = item.Split("|||");
                            if (data[0].Length > 0)
                            {
                                for (int i = 0; i < detalle.ToList().Count; i++)
                                {
                                    if (detalle[i].iddetalle.ToString() == data[0] && detalle[i].estado == "ELIMINADO")
                                    {
                                        detalle[i].estado = "HABILITADO";
                                        detalle[i].descripcion = data[1];
                                        detalle[i].tipopedido_codigo = int.Parse(data[3]);

                                        break;
                                    }
                                }
                            }
                        }
                        db.UpdateRange(detalle);
                        await db.SaveChangesAsync();

                        pedido.total = (double)detalle.Where(x=>x.estado=="HABILITADO").Sum(x => x.subtotal);
                        pedido.idpaciente = e.idpaciente;
                        pedido.idcliente = e.idcliente;
                        pedido.idmedico = e.idmedico;
                        pedido.idorigenreceta = e.idorigenreceta;
                        pedido.usuariomodifica = e.idusuario;
                        db.Update(pedido);
                        await db.SaveChangesAsync();

                        //para editar la direccion de envio EARTCOD1005
                        if (pedido.tiporegistro == "DELIVERY")
                        {
                            var delivery = await db.DELIVERY.FindAsync(e.iddelivery);
                            delivery.direcciondeenvio = e.direcciondeenvio;
                            db.Update(delivery);
                            await db.SaveChangesAsync();
                        }
                        //---------------------------

                        await transaccion.CommitAsync();
                        return new mensajeJson("ok", null);

                    }
                    catch (Exception err)
                    {
                        await transaccion.RollbackAsync();
                        return new mensajeJson(err.Message, null);
                    }
                }
            


            }

        }
    }
}
