using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Ventas.cajas.command
{
   public class GuardarPreCierre
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string observaciones { get; set; }
            public int idapertura { get; set; }
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
                    var aperturar = await db.APERTURACAJA.FindAsync(e.idapertura);
                    aperturar.observaciones = e.observaciones;
                    db.Update(aperturar);
                    await db.SaveChangesAsync();
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
