using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.producto.query
{
    public class BuscarProductos1
    {
        public class Ejecutar : IRequest<object>
        {
          
            public string producto { get; set; }
            public string tipo { get; set; }
            public int? top { get; set; }
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
                e.producto = e.producto ?? "";
                e.top = e.top ?? 10;
                var data =await (from p in db.APRODUCTO
                            where p.estado == "HABILITADO" && 
                            (p.nombre.Contains(e.producto) || p.codigoproducto.Contains(e.producto) || p.codigobarra.Contains(e.producto))
                            && p.idtipoproducto==e.tipo
                            select new
                            {
                                p.codigoproducto,
                                p.nombre,
                                p.idproducto
                            }

                          ).Take(e.top.Value).ToListAsync();
                return data;
            }
        }
    }
}
