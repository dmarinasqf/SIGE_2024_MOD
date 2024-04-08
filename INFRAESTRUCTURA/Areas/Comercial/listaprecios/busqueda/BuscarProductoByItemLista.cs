using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.busqueda
{
    public class BuscarProductoByItemLista
    {
        public class Ejecutar : IRequest<object>
        {
            public long idprecio { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo _db)
            {
                db = _db;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var item = await db.PRECIOSPRODUCTO.FindAsync(e.idprecio);
                    if (item is null)
                        return new mensajeJson("No existe item en la lista de precios", null);

                    var producto = db.APRODUCTO.Find(item.idproducto);
                    if (producto is null)
                        return new mensajeJson("No existe producto", null);
                    var obj = new
                    {
                        producto.idproducto,
                        producto.codigoproducto,
                        producto.nombre,
                        producto.idtipoproducto,
                        multiplo = producto.multiplo ?? 0,
                        item.precio,
                        precioxfraccion = item.precioxfraccion ?? 0,
                        item.idprecioproducto
                    };
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
