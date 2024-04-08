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
    public class ListarHorarioConsultorioxDia
    {
        public class Ejecutar : IRequest<object>
        {
            public int consultorio { get; set; }
            public DateTime fecha { get; set; }
        }
        public class Manejador :IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento procedimiento;
            public Manejador(IEjecutarProcedimiento procedimiento_)
            {
                procedimiento = procedimiento_;
            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                string fechaaux = e.fecha.ToString("yyyy/MM/dd");
                var stroreprocedure = "SP_ListarHorarioConsultorioxDia";
                var parametros = new Dictionary<string, object>();

                parametros.Add("consultorioCodigo", e.consultorio);
                parametros.Add("fecha", fechaaux);


                var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                return data;
            }
        }


    }
    
}
