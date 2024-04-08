using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.empleado.query
{
   public class ValidarCredenciales
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            [Required]
            public string usuario { get; set; }
            [Required]
            public string clave { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;
            private readonly UserManager<AppUser> Appuser;
            public Manejador(Modelo context, IUser user_, UserManager<AppUser> Appuser_)
            {
                db = context;
                user = user_;
                Appuser = Appuser_;
            }
            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {                    
                    var usuario = await Appuser.FindByNameAsync(e.usuario);
                    if (usuario is null)
                        return new mensajeJson("No existe usuario", null);
                    var empleado = db.EMPLEADO.Find(int.Parse( usuario.Id));
                    if (empleado is null)
                        return new mensajeJson("No existe empleado", null);
                    if (empleado.clave != e.clave)
                        return new mensajeJson("La contraseña es incorrecta",null);

                    return new mensajeJson("ok", new { idempleado=empleado.emp_codigo});

                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }


            }

        }
    }
}
