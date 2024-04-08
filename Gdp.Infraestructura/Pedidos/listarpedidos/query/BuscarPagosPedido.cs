using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
   public class BuscarPagosPedido
    {
        public class Ejecutar : IRequest<object>
        {
            public int idpedido { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
               
                var data =await (from p in db.PAGOSPEDIDO
                            join c in db.FCUENTA on p.idcuenta equals c.idcuenta
                            where p.idpedido == e.idpedido && p.estado == "HABILITADO"
                            select new
                            {
                                p.idpago,
                                p.imagen,
                                p.isinterbancario,
                                p.numoperacion,
                                p.fecha,
                                p.monto,
                                cuenta=c.descripcion
                            }).ToListAsync();
                return data;

            }
        }
    }
}
