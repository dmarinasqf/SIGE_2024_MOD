using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;

using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.cliente.query
{
    public class BuscarClienteCompleto
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
                try
                {
                    var cliente = await db.CLIENTE.FindAsync(e.idcliente);
                    if (cliente is null)
                        return new mensajeJson("No existe cliente", null);
                    var asociado = db.CLIENTEASOCIADO.Where(x => x.idcliente == e.idcliente).FirstOrDefault();
                    if (asociado is not null)
                    {
                        if (asociado.idmedico is not null)
                        {
                            var medico = db.MEDICO.Find(asociado.idmedico);
                            asociado.cmp = medico.nrocolegiatura;
                            asociado.nombremedico = medico.nombres + " " + medico.apepaterno + " " + medico.apematerno;
                        }

                        cliente.clienteasociado = asociado;
                    }
                    return new mensajeJson("ok", cliente);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }
        }
    }
}
