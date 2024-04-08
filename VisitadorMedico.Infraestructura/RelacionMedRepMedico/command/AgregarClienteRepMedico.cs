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

namespace VisitadorMedico.Infraestructura.RelacionMedRepMedico.command
{
    public class AgregarClienteRepMedico
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
                    var objVerificar = db.REPMEDICOCLIASIGNADOS.Where(x => x.idcanalventa == e.idcanalventa
                    && x.idcliente == e.idcliente && x.idrepresentante == e.idrepresentante).FirstOrDefault();
                    if (objVerificar != null)
                    {
                        if (objVerificar.estado == "DESHABILITADO")
                        {
                            objVerificar.estado = "HABILITADO";
                            db.Update(objVerificar);
                            db.SaveChanges();
                        }
                    }
                    else
                    {
                        await db.REPMEDICOCLIASIGNADOS.AddAsync(new RepMedicoCliAsignados
                        {
                            idcliente = e.idcliente,
                            idcanalventa = e.idcanalventa,
                            idrepresentante = e.idrepresentante,
                            estado = "HABILITADO"
                        });
                        await db.SaveChangesAsync();
                    }
                    return (new mensajeJson("ok", null));
                }
                catch (Exception err)
                {
                    return (new mensajeJson(err.Message, null));
                }


            }


        }
    }
}
