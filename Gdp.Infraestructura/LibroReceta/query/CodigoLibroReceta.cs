using ENTIDADES.gdp;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.LibroReceta.query
{
    public class CodigoLibroReceta
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string tipo { get; set; }
            public int sucursalcliente { get; set; }
            public int iddetalle { get; set; }
        }


        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                try
                {
                    var data = new LIBRORECETAS();
                    if (request?.tipo == "QF")
                    {
                        data = await db.LIBRORECETAS
                            .Where(o => o.detp_codigo == request.iddetalle && o.registro == request.tipo && o.suc_codigo == request.sucursalcliente)
                            .FirstOrDefaultAsync();
                    }

                    if (request?.tipo == "CLIENTE")
                    {
                        data = await db.LIBRORECETAS
                            .Where(o => o.detp_codigo == request.iddetalle && o.registro == request.tipo && o.cliTercero_codigo == request.sucursalcliente)
                            .FirstOrDefaultAsync();
                    }
                    var msj = new mensajeJson();

                    msj = (data == null) ? new mensajeJson("0", null) : new mensajeJson("ok",data);

                    return msj;

                }
                catch (Exception ex)
                {
                    return new mensajeJson(ex.Message, null);
                }
            }
        }
    }
}
