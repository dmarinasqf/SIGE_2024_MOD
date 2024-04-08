using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.sucursal.query
{
    public class ListarEmpleadosSucursal
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idlaboratorio { get; set; }
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
                    var formuladores = await db.EMPLEADO.Where(x => x.suc_codigo == e.idlaboratorio  && x.estado=="HABILITADO")
                        .Select(x => new
                        {
                            idempleado=x.emp_codigo,
                            nombres=x.nombres,
                            appaterno=x.apePaterno,
                            apmaterno=x.apeMaterno,
                            usuario=x.userName
                        }).ToListAsync();
                    return new mensajeJson("ok", formuladores);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }

        }
    }
}
