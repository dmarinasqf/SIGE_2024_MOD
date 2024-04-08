using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.cliente.query
{
   public class BuscarDireccionCliente
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idcliente { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db_)
            {
                db = db_;

            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var cliente = await db.CLIENTE.FindAsync(e.idcliente);
                if (cliente is null)
                    return new mensajeJson("no existe cliente", null);
                else
                    return new mensajeJson("ok", new
                    {
                        cliente.idcliente,
                        cliente.iddepartamento,
                        cliente.iddistrito,
                        cliente.idprovincia,
                        cliente.direccion,
                        cliente.direccionentrega,
                        cliente.telefono,
                        cliente.celular,
                        cliente.nrodocumento
                    });

            }
        }
    }
}
