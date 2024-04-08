using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.Maestros.objetivos
{
    public class ListarObjetivos
    {
        public class Ejecutar : IRequest<object>
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {

            private readonly IEjecutarProcedimiento procedimiento;
            public Manejador(IEjecutarProcedimiento procedimiento_)
            {
                procedimiento = procedimiento_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var stroreprocedure = "SP_ListarObjetivosRM";
                var parametros = new Dictionary<string, object>();
                string fechaIc = e.fechainicio;
                string fechaFc =e.fechafin;

                parametros.Add("fechafin", fechaFc);
                parametros.Add("fechainicio", fechaIc);              
             
                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;

            }
        }
    }
}
