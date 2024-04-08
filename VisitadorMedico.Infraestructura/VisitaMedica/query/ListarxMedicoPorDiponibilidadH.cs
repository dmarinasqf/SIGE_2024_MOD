using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VisitadorMedico.Infraestructura.VisitaMedica.query
{
    public class ListarxMedicoPorDiponibilidadH
    {
        public class Ejecutar : IRequest<object>
        {
            public DateTime finicio { get; set; }
            public DateTime ffin { get; set; }
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
                //string fechaauxi = e.finicio.ToString("yyyy/MM/dd");
                //string fechaauxf = e.ffin.ToString("yyyy/MM/dd");
                var stroreprocedure = "SP_ListarxMedicoPorDiponibilidadH";
                var parametros = new Dictionary<string, object>();

                parametros.Add("fechaInicio", e.finicio);
                parametros.Add("fechaFin", e.ffin);


                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
        }
    }
}
