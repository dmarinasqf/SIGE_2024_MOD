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

namespace INFRAESTRUCTURA.Areas.Maestros.cliente.command
{
    public class RegistrarEditarAsociado
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public ClienteAsociado cliente { get; set; }
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
                if (e.cliente.idclienteasociado is 0)
                    return await crearAsync(e.cliente);
                else
                    return await editarAsync(e.cliente);


            }

            private async Task<mensajeJson> editarAsync(ClienteAsociado cliente)
            {
                try
                {
                                                        
                        db.Update(cliente);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", cliente);                   

                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }
            }

            private async Task<mensajeJson> crearAsync(ClienteAsociado cliente)
            {
                try
                {

                    var auxcliente = db.CLIENTEASOCIADO.Where(x => x.idcliente == cliente.idcliente).ToList().LastOrDefault();

                    if (auxcliente is not null)
                    {
                        cliente.idclienteasociado = auxcliente.idclienteasociado;
                        db.Update(cliente);
                    }
                    else
                        await db.AddAsync(cliente);


                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", cliente);
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }
            }
        }
    }
}
