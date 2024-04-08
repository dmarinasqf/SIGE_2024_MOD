using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.Maestros.objetivos
{
   public class ElimnarObjetivo
    {
        public class Ejecutar : IRequest<object>
        {
            public int id { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var obj = db.OBJETIVOREPMEDICO.Find(e.id);
                    obj.estado = "ELIMINADO";
                    db.Update(obj);
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
