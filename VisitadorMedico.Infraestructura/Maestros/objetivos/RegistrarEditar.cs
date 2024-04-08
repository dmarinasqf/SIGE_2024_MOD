using Erp.Entidades.visitadormedico;
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
   public class RegistrarEditar
    {
        public class Ejecutar : IRequest<object>
        {
            public ObjetivoRepMedico objetivo { get; set; }
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
                    var obj = e.objetivo;
                    if (obj.idobjetivo is 0)
                        await db.AddAsync(obj);
                    else
                    {
                        var objaux = db.OBJETIVOREPMEDICO.Find(obj.idobjetivo);
                        objaux.descripcion = obj.descripcion;
                        objaux.fechainicio = obj.fechainicio;
                        objaux.fechavence = obj.fechavence;
                        db.Update(objaux);
                    }

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
