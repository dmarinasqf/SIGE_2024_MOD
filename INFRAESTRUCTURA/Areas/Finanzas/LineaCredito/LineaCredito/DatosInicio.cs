using INFRAESTRUCTURA.Areas.Finanzas.ViewModels;
using Erp.Persistencia.Modelos;
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
   public class DatosInicio
    {
        public class Ejecutar : IRequest<LineaCreditoModel> { }
        public class Manejador : IRequestHandler<Ejecutar, LineaCreditoModel>
        {
            private readonly Modelo db;
           
            public Manejador(Modelo context)
            {
                db = context;
            
            }

            public async Task<LineaCreditoModel> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                LineaCreditoModel data = new LineaCreditoModel();
                data.condicionpagos = await db.CCONDICIONPAGO.Where(x => x.estado == "HABILITADO").ToListAsync();
                data.monedas = await db.FMONEDA.Where(x => x.estado == "HABILITADO").ToListAsync();
                return data;

            }
        }
    }
}
