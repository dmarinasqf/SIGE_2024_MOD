using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento
{
   public class BuscarPacientes
    {
        public class Ejecutar : IRequest<object>
        {
            public string filtro { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            private readonly IEjecutarProcedimiento procedimiento;
          
            public Manejador(Modelo db_, IEjecutarProcedimiento procedimiento_)
            {
                db = db_;
                procedimiento = procedimiento_;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.top == 0) e.top = 10;
                var stroreprocedure = "SP_BUSCARPACIENTE";
                var parametros = new Dictionary<string, object>();
                parametros.Add("top", e.top);
                parametros.Add("filtro", e.filtro);
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
        }
    }
}
