using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.medico.mantenimiento
{
   public class BuscarMedicoByNumColegio
    {
        public class Ejecutar : IRequest<mensajeJson>
        {           
            public string numcolegio { get; set; }
            public int idcolegio { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
           
            public Manejador(Modelo db_)
            {
                db = db_;             
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                e.numcolegio = e.numcolegio ?? "";
                e.numcolegio = e.numcolegio.Trim();
                try
                {
                    if (e.idcolegio is 0)
                    {
                        var medico = await db.MEDICO.Where(x => (x.estado != "HABILITADO" || x.estado == null) && x.nrocolegiatura == e.numcolegio).FirstOrDefaultAsync();
                        if (medico is null)
                            return new mensajeJson("No existe médico", null);
                        else
                            return new mensajeJson("ok", new
                            {
                                medico.idmedico,
                                medico.apematerno,
                                medico.apepaterno,
                                medico.nombres,
                                medico.nrocolegiatura
                            });
                    }
                    else
                    {
                        var medico = await db.MEDICO.Where(x => (x.estado == "HABILITADO" || x.estado == null) && x.nrocolegiatura == e.numcolegio && x.idcolegio == e.idcolegio).FirstOrDefaultAsync();
                        if (medico is null)
                            return new mensajeJson("No existe médico", null);
                        else
                            return new mensajeJson("ok", new
                            {
                                medico.idmedico,
                                medico.apematerno,
                                medico.apepaterno,
                                medico.nrocolegiatura,
                                medico.nombres,
                            });
                    }
                }
                catch (Exception err)
                {

                    return new mensajeJson(err.Message, null);
                }
                

            }
        }
    }
}
