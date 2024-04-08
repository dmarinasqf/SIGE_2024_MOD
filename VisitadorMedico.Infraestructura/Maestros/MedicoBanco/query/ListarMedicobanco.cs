using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.Maestros.MedicoBanco.query
{
    public class ListarMedicobanco
    {
        public class Ejecutar : IRequest<object>
        {
            public int codigo { get; set; }
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
                if (e.codigo > 0)
                {
                    var data = await (from mb in db.MEDICOBANCO join b in db.FBANCO on mb.idbanco equals b.idbanco where mb.estado!="ELIMINADO" && mb.idmedico== e.codigo
                            select new { mb.iddetalle, mb.idmedico, b.descripcion,mb.idbanco, mb.estado, mb.cuenta, mb.cci }).ToListAsync();
                    //var data = await db.MEDICOBANCO.Where(x => x.estado != "ELIMINADO" && x.idmedico==e.codigo).Select(x => new { x.iddetalle, x.idmedico, x.idbanco, x.estado }).ToListAsync();
                    return data;
                }else
                {
                    return null;
                }
            }
        }
    }
}
