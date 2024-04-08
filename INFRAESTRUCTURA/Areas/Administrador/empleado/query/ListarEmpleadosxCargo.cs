using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.empleado.query
{
    public  class ListarEmpleadosxCargo
    {
        public class Ejecutar : IRequest<object>
        {
            public string cargos { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;

            }
            public async Task<object> Handle(Ejecutar ee, CancellationToken cancellationToken)
            {
                if (ee.cargos is null) ee.cargos = "";
                var query =await ( from e in db.EMPLEADO
                             join s in db.SUCURSAL on e.suc_codigo equals s.suc_codigo
                             join c in db.CARGOEMLEADO on e.idcargo equals c.idcargo
                             where e.estado == "HABILITADO" && ee.cargos.Contains(c.descripcion)                           
                            select new 
                            {
                                idempleado = e.emp_codigo,
                                nombres = e.nombres,
                                apematerno = e.apeMaterno,
                                apepaterno = e.apePaterno,
                                documento = e.documento,
                                local = s.descripcion,

                            }).ToListAsync();
                return query;

            }

        }
    }
}
