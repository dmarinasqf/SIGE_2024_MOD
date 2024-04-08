using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.command
{
    public class EliminarPreciosCliente
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idlista { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly Modelo db;
            private readonly IUser user;

            public Manejador(Modelo _db, IUser user_)
            {
                db = _db;
                user = user_;
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                try
                {
                    var data=await db.PRECIOSPRODUCTO.Where(x=>x.idlistaprecio==e.idlista && x.estado=="HABILITADO").ToListAsync();
                    data.ForEach(x =>
                    {
                        x.iseditable = false;
                        x.estado = "ELIMINADO";
                        x.fechaedicion = DateTime.Now;
                        x.usuariomodifica = user.getIdSucursalUsuario();
                    });
                    db.UpdateRange(data);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", null);
                }
                catch (Exception err)
                {
                    return new mensajeJson(err.Message, null);
                }
              
            }
        }
    }
}
