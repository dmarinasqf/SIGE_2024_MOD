using Erp.Persistencia.Repositorios.Common;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Asistencia.control.query
{
    public class GetListarEmpleadosA
    {
        public class Ejecutar : IRequest<object>
        {
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
                try
                {
                    var stroreprocedure = "asistencia.SP_UsuariosAutorizantes";
                    var parametros = new Dictionary<string, object>();

                    var data = await procedimiento.HandlerDictionaryAsync(stroreprocedure, parametros);
                    return data;
                }
                catch (Exception err)
                {

                    return err.Message;
                }
                
            }
        }
    }
}
