using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.Maestros.Medico.query
{
    public class ListarMedicoxId
    {
        public class Ejecutar : IRequest<object>
        {
            public int codigo { get; set; }
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
                try
                {
                    if (e.codigo is > 0)
                    {
                        var data = await db.MEDICO.Where(x => x.idmedico == e.codigo).ToListAsync();
                        return data;
                    }
                    else
                    {
                        return null;
                    }
                }catch(Exception ex)
                {
                    return null;
                }  
            }
        }
    }
}
