using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.command
{
    public class AdelantoPedido
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idpedido { get; set; }
            public decimal? monto { get; set; }
            public int? idtipopago { get; set; }
            public DateTime? fechafacturacion { get; set; }
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
                    
                    if (e.idtipopago is not null && e.monto > 0)
                    {
                        var pedido =await db.PEDIDO.FindAsync(e.idpedido);
                        pedido.saldo = 0;
                        pedido.adelanto += (double)e.monto;
                        if (pedido.total != pedido.adelanto)
                            return new mensajeJson("El adelanto es mayor al total del pedido", null);
                        pedido.iseditable = false;
                        db.Update(pedido);
                        await db.SaveChangesAsync();
                        var Pago = new PagosPedido();
                        Pago.idpedido = e.idpedido;
                        Pago.monto = e.monto;
                        Pago.idtipopago = e.idtipopago;
                        Pago.estado = "HABILITADO";
                        await db.AddAsync(Pago);
                        await db.SaveChangesAsync();
                    }

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
