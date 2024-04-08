using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.VisitaMedica.query
{
    public class ListarConsultorioPorSucursal
    {
        public class Ejecutar: IRequest<object>
        {
            public int id { get; set; }
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
                if (e.id is > 0)
                { 
                    var data = await db.CONSULTORIO.Where(x => x.estado != "ELIMINADO" && x.suc_codigo == e.id).OrderBy(x => x.descripcion).ToListAsync();
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
