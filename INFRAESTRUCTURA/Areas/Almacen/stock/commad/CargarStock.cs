using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.stock.commad
{
   public class CargarStock
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idalmacen { get; set; }          
            public string idusuario { get; set; }
            public int cantidad { get; set; }
            public string tipo { get; set; }
            public string idtabla { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
            private readonly Modelo db;
            private readonly UserManager<AppUser> Appuser;
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_, Modelo db_, UserManager<AppUser> Appuser_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
                db = db_;
                Appuser = Appuser_;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var usuario = await Appuser.FindByIdAsync(e.idusuario);
                    if (usuario is null)
                        return new mensajeJson("No existe usuario", null);
                    if ((await Appuser.IsInRoleAsync(usuario, "ADMINISTRADOR")) && (await Appuser.IsInRoleAsync(usuario, "CARGAR STOCK FM")))
                    {
                        return new mensajeJson("No tiene los permisos para realizar esta operación", null);
                    }
                    var storeprocedure = "Almacen.sp_cargar_stock_fm";
                    var parametros = new Dictionary<string, object>();
                    parametros.Add("idalmacen", e.idalmacen);
                    parametros.Add("cantidad", e.cantidad);
                    parametros.Add("usuario", e.idusuario);
                    parametros.Add("idtabla", e.idtabla);
                    parametros.Add("tipo", e.tipo);
                    var ejecutar = await ejecutarProcedimiento.HandlerDictionaryAsync(storeprocedure, parametros);

                    return new mensajeJson("ok", ejecutar);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }

            }
        }
    }
}
