using ENTIDADES.finanzas;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito.DocumentosPorCobrar
{
   public class RegistrarPago
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public List<int> ids { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;
            public Manejador(Modelo db_,IUser _user)
            {
                db = db_;
                user = _user;
            }
            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                try
                {
                    var usuario = user.getIdUserSession();
                    var documentos = new List<FLineaCreditoCobroCliente>();
                    foreach (var item in request.ids)
                    {
                        var obj = db.FLINEACREDITOCOBROCLIENTE.Find(item);
                        documentos.Add(obj);
                    }
                    documentos.ForEach(x => x.ispagado = true);
                    documentos.ForEach(x => x.usuariomodifica = usuario);
                    documentos.ForEach(x => x.fechaedicion = DateTime.Now);
                    db.UpdateRange(documentos);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", null);
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, null);
                }               
            }
        }
    }
}
