using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.SeedWork;
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
    public class ListarMedicosByOReceta
    {
        public class Ejecutar : IRequest<object>
        {
            public int idorigen { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            public Manejador(Modelo db_)
            {
                db = db_;
            }
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var datos = await db.MEDICO.Where(x => x.idorigen1 == e.idorigen || x.idorigen2 == e.idorigen || x.idorigen3 == e.idorigen).ToListAsync();
                for (int i = 0; i < datos.Count; i++)
                {
                    if (datos[i].idespecialidad != null)
                        datos[i].especialidad = db.ESPECIALIDAD.Find(datos[i].idespecialidad).descripcion;
                    if (datos[i].idcolegio != null)
                        datos[i].colegio = db.COLEGIOMEDICO.Find(datos[i].idcolegio).abreviatura;
                }
                return datos.Select(x => new
                { 
                    x.idmedico,
                    x.nombres,
                    x.apepaterno,
                    x.apematerno,
                    x.especialidad,
                    x.nrocolegiatura,
                    x.colegio
                } ).ToList();
            }
        }
    }
}
