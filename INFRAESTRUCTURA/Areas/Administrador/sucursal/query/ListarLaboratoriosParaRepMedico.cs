using Erp.Persistencia.Modelos;
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
    public class ListarLaboratoriosParaRepMedico
    {
        public class Ejecutar : IRequest<object>
        {
            public int empleado { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {

                if (e.empleado is > 0)
                {
                    var data = await db.SUCURSALES_REPMEDICO.Where(x => x.emp_codigo == e.empleado && x.sucursal.tipoSucursal == "PRODUCCIÓN").ToListAsync();
                    return data;
                }
                else
                {
                    return null;
                }
               
            }
        }
    }
}
