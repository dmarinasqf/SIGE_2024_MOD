using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.query
{
    public class ValidarDeposito
    {
        public class Ejecutar : IRequest<mensajeJson> 
        {
            public string fechainicio { get; set; }
            public string fechafin { get; set; }
            public string tipo { get; set; }
        }


        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento _execute;

            public Manejador(IEjecutarProcedimiento execute)
            {
                _execute = execute;
            }
            public async Task<mensajeJson> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var mensajeJson = new mensajeJson();
                try
                {
                    var stroreprocedure = "SP_LISTAR_DEPOSITOS_APROBACION";
                    var parametros = new Dictionary<string, object>();

                    parametros.Add("FECHAINICIO", request.fechainicio ?? "");
                    parametros.Add("FECHAFIN", request.fechafin ?? "");
                    parametros.Add("TIPO", request.tipo ?? "EXPORTACION");
                    mensajeJson.objeto = await _execute.HandlerDictionaryAsync(stroreprocedure, parametros);
                    mensajeJson.mensaje = "ok";
                }
                catch (Exception ex)
                {
                    mensajeJson.mensaje = ex.Message;
                }
              
                return mensajeJson;
            }
        }
    }
}
