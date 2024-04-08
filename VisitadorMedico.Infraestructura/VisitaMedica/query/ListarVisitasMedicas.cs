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
  
        public class ListarVisitasMedicas
        {
            public class Ejecutar : IRequest<object>
            {
                public string idrepresentante { get; set; }
                public string idmedico { get; set; }
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
                    var stroreprocedure = "SP_ListarRegistrosVisitasMedicas";
                    var parametros = new Dictionary<string, object>();

                    parametros.Add("idrepresentante", e.idrepresentante);
                    parametros.Add("idmedico", e.idmedico);


                    var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                    return data;

                }


            }
        }
}
