using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.RelacionMedRepMedico.command
{
    public class DeshabilitarClienteRepMedico
    {
        public class Ejecutar : IRequest<object>
        {
            public int idcliente { get; set; }
            public int idrepresentante { get; set; }
            public string idcanalventa { get; set; }
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
                    var objVerificacion = db.REPMEDICOCLIASIGNADOS.Where(x => x.idcliente == e.idcliente &&
                    x.idrepresentante == e.idrepresentante && x.idcanalventa == e.idcanalventa).FirstOrDefault();
                    if (objVerificacion != null)
                    {
                        objVerificacion.estado = "DESHABILITADO";
                        db.REPMEDICOCLIASIGNADOS.Update(objVerificacion);
                        await db.SaveChangesAsync();
                    }
                    return new mensajeJson("ok", null);
                }
                catch (Exception err)
                {
                    return (new mensajeJson(err.Message, null));
                }
            }
        }
    }
}
