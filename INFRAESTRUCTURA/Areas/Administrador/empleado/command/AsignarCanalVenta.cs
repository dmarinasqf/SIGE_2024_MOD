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

namespace Erp.Infraestructura.Areas.Administrador.empleado.command
{
    public class AsignarCanalVenta
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idempleado { get; set; }
            public string idcanalventa { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
          
            public Manejador(Modelo context )
            {
                db = context;
               
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {

                    var obj = db.EMPLEADOCANALVENTA.Where(x => x.idempleado == e.idempleado && x.idcanalventa == e.idcanalventa).FirstOrDefault();
                    if (obj is null)
                        db.EMPLEADOCANALVENTA.Add(new EmpleadoCanalVenta { idcanalventa = e.idcanalventa, idempleado = e.idempleado});
                    else
                    {
                        db.Remove(obj);
                    }

                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", null));
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }

        }
    }
}
