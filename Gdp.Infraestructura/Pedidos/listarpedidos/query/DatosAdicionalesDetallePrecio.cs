using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
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
    public  class DatosAdicionalesDetallePrecio
    {
        public class Ejecutar : IRequest<object>
        {
            public string tipo { get; set; }
            public int iddetalle { get; set; }
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
                var detalle = await db.DETALLEPEDIDO.FindAsync(e.iddetalle);
                if(e.tipo=="actual")
                {
                    var data = await db.PRECIODETALLE.Where(x => x.idprecioproducto == detalle.idprecioproducto).FirstOrDefaultAsync();
                    return new
                    {
                        data.formulacion,
                        data.etiqueta,
                        data.observacion,
                        data.presentacion,
                        nombre = ""
                    };

                }else
                {
                    var data = await db.CATALAGOPRECIOS.FindAsync(detalle.idprecioproductoanterior);
                    return new
                    {
                        data.formulacion,
                        data.etiqueta,
                        data.observacion,
                        data.presentacion,
                        nombre = data.articulo
                    };
                }

            }
        }
    }
}
