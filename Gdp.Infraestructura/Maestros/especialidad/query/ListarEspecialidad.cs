using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Maestros.especialidad.query
{
    public class ListarEspecialidad
    {
        public class Ejecutar : IRequest<object>
        {
            public string tipo { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            private readonly IEjecutarProcedimiento procedimiento;
            public Manejador(Modelo db, IEjecutarProcedimiento procedimiento)
            {
                this.db = db;
                this.procedimiento = procedimiento;
            }

            public async Task<object> Handle(Ejecutar r, CancellationToken cancellationToken)
            {
                if (r.tipo is null || r.tipo is "")
                {
                    var data = await (from e in db.ESPECIALIDAD join cm in db.COLEGIOMEDICO on e.idcolegio equals cm.idcolegio
                                      where e.estado == "HABILITADO"
                                      select new
                                      {
                                          e.esp_codigo,
                                          e.descripcion,
                                          colegio=cm.abreviatura,
                                          cm.idcolegio,
                                          e.estado
                                      }).ToListAsync();
                    return data;
                }else if (r.tipo is "todo")
                {
                    var data = await (from e in db.ESPECIALIDAD
                                      join cm in db.COLEGIOMEDICO on e.idcolegio equals cm.idcolegio
                                      where e.estado != "ELIMINADO"
                                      select new
                                      {
                                          e.esp_codigo,
                                          e.descripcion,
                                          colegio = cm.abreviatura,
                                          cm.idcolegio,
                                          e.estado
                                      }).ToListAsync();
                    return data;
                }
                else if (r.tipo is "procedimiento")
                {
                    var stroreprocedure = "[sp_listarEspecialidad]";
                    var parametros = new Dictionary<string, object>();

                    var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                    return data;
                }
                else
                {
                    {
                        var data = await (from e in db.ESPECIALIDAD
                                          join cm in db.COLEGIOMEDICO on e.idcolegio equals cm.idcolegio
                                          where e.estado == "HABILITADO"
                                          select new
                                          {
                                              e.esp_codigo,
                                              e.descripcion,
                                              colegio = cm.abreviatura,
                                              cm.idcolegio,
                                              e.estado
                                          }).ToListAsync();
                        return data;
                    }
                }
            }
        }
    }
}
