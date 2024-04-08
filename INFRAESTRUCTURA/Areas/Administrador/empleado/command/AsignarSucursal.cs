using Erp.Entidades.Generales;
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
    public class AsignarSucursal
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idempleado { get; set; }
            public int idsucursal { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {

                    var obj = db.EMPLEADOSUCURSAL.Where(x => x.idempleado == e.idempleado && x.idsucursal == e.idsucursal).FirstOrDefault();
                    if (obj is null)
                        db.EMPLEADOSUCURSAL.Add(new EmpleadoSucursal { idsucursal = e.idsucursal, idempleado = e.idempleado });
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
