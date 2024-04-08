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

namespace Gdp.Infraestructura.Asistencia.control.query
{
    public class GetUltimoRegistro
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string documento { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;

            public Manejador(Modelo db)
            {
                this.db = db;
            }
            
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                string fechas = DateTime.Now.ToShortDateString();
                string fecha = DateTime.Now.ToString("dd/MM/yyyy");
                try
                {
                    var data = await db.ASISREGISTROES.Where(x => x.documento == e.documento && x.fecha==fechas).Select(x => new { 
                    x.idAsistencia,x.temperatura,x.temperaturaf,x.observacion, x.observacionf,x.fechaIngreso,x.fechaIAlmuerzo,x.fechaFAlmuerzo,
                        x.fechaSalidaEmergencia,x.fechaSalida,x.fechaIHoraExtra,x.fechaFHoraExtra
                    }).FirstOrDefaultAsync();


                    //var dt = await db.ASISREGISTROES.Where(x => x.documento == e.documento && x.fecha.Contains(fechas)).FirstOrDefaultAsync();

                    if (data != null)
                    {
                        return (new mensajeJson("encontrado", data));
                    }
                    else
                    {
                        var dt = await db.ASISREGISTROES.Where(x => x.documento == e.documento && x.fecha.Contains(fechas)).FirstOrDefaultAsync();
                        return (new mensajeJson("no encontrado", dt));
                    }
                }
                catch (Exception EX)
                {

                    return new mensajeJson(EX.Message, fechas);
                }
            }
        }
    }
}
