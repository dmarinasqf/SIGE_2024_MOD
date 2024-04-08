using ENTIDADES.comercial;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.command
{
    public class CrearListaCliente
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string idcliente { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo _db)
            {
                db = _db;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var listacliente = db.LISTAPRECIOS.Where(x => x.descripcion == e.idcliente && x.tipo == "cliente").FirstOrDefault();
                if (listacliente is null)
                {
                    var lista = new ListaPrecios();
                    lista.descripcion = e.idcliente;
                    lista.estado = "HABILITADO";
                    lista.tipo = "cliente";
                    await db.AddAsync(lista);
                }
                else if (listacliente.estado == "ELIMINADO" || listacliente.estado == "DESHABILITADO")
                {
                    listacliente.estado = "HABILITADO";
                    db.Update(listacliente);

                }
                else
                    return new mensajeJson("Ya se ha creado la lista para el cliente", null);

                await db.SaveChangesAsync();
                return new mensajeJson("ok", null);
             
            }
        }
    }
}
