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

namespace INFRAESTRUCTURA.Areas.Finanzas.LineaCredito
{
    public class ListarCreditosCliente
    {
        public class Ejecutar : IRequest<object>
        {
            public int idcliente { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;

            public Manejador(Modelo context)
            {
                db = context;
            }

            public async Task<object> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var data = await (from h in db.FLINEACREDITOHISTORIAL
                            join e in db.EMPLEADO on h.usuariocrea equals e.emp_codigo.ToString()
                            where h.idcliente==request.idcliente && h.estado=="HABILITADO"
                            orderby h.fechacreacion descending
                            select new
                            {
                                usuario=e.userName,
                                fecha=h.fechacreacion,
                                h.montoactual,
                                h.montoingresado
                            }).ToListAsync();
                return data;
            }
        }
    }
}
