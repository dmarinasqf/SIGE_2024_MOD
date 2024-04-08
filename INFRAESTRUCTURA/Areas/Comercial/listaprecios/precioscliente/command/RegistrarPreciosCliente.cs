using Erp.Infraestructura.Areas.Comercial.listaprecios.Dto;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.command
{
    public class RegistrarPreciosCliente
    {
        public class Ejecutar : IRequest<object>
        {
            public int idlista { get; set; }
            public List<ListaDto> data { get; set; }
        }
       
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            private readonly IUser user;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_, IUser user_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
                user = user_;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                if (e.data == null)
                    return new mensajeJson("No hay data", null);
                if(e.data.Count==0)
                    return new mensajeJson("No hay data", null);

                var stroreprocedure = "Comercial.sp_registrar_precio_cliente";

                var parametros = new List< Dictionary<string, object>>();

                foreach (var item in e.data)
                {
                    var parametro = new Dictionary<string, object>();
                    parametro.Add("idlista", e.idlista);
                    parametro.Add("codigoproducto", item.codigoproducto);
                    parametro.Add("precio", item.precio??0);
                    parametro.Add("precioxfraccion", item.precioxfraccion??0);
                    parametro.Add("usuario", user.getIdUserSession());
                    parametro.Add("formulacion", item.formulacion);
                    parametro.Add("presentacion", item.presentacion);
                    parametro.Add("etiqueta", item.etiqueta);
                    parametro.Add("observacion", item.observacion);
                    parametro.Add("codigocliente", item.codcliente);
                    parametro.Add("descripcion", item.descripcion);
                    parametros.Add(parametro);
                }
               

                return await ejecutarProcedimiento.HandlerSaveBlockAsync(stroreprocedure, parametros);
            }
        }
    }
}
