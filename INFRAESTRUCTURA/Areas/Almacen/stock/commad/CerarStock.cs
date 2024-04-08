using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.stock.commad
{
    public class CerarStock
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public string laboratorios { get; set; }
            public string sucursales { get; set; }
            public string tipo { get; set; }
            public string idusuario { get; set; }
            public string tipoproducto { get; set; }
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
                    if ((await Appuser.IsInRoleAsync(usuario, "ADMINISTRADOR")) && (await Appuser.IsInRoleAsync(usuario, "CERAR STOCK")))
                    {
                        return new mensajeJson("No tiene los permisos para realizar esta operación", null);
                    }

                    var sucursales = e.sucursales.Split("|");
                    if (sucursales.Length is 0)
                        return new mensajeJson("Seleccione sucursal", null);
                    if (e.tipo == "todo")
                    {
                        foreach (var item in sucursales)
                        {
                            if (item is not "")
                            {
                                var stock = await (from st in db.ASTOCKPRODUCTOLOTE
                                                   join als in db.AALMACENSUCURSAL on st.idalmacensucursal equals als.idalmacensucursal
                                                   join p in db.APRODUCTO on st.idproducto equals p.idproducto
                                                   where als.suc_codigo == int.Parse(item) && st.estado == "HABILITADO" && st.candisponible > 0
                                                   && p.idtipoproducto==e.tipoproducto
                                                   select st).ToListAsync();
                                stock.ForEach(x =>
                                {
                                    x.edicion = x.setedicion("SALIDA", "CerarSTock", "", x.candisponible.ToString());
                                    x.candisponible = 0;
                                    x.iseditable = false;
                                    x.usuariomodifica = e.idusuario;
                                    x.fechaedicion = DateTime.Now;
                                });
                                db.UpdateRange(stock);
                                await db.SaveChangesAsync();
                            }
                        }
                    }
                    else if(e.tipo=="laboratorio")
                    {
                        foreach (var item in sucursales)
                        {
                            if (item is not "")
                            {
                                var laboratorios = e.laboratorios.Split("|");
                                foreach (var lab in laboratorios)
                                {
                                    if(lab is not "")
                                    {
                                        var stock = await (from st in db.ASTOCKPRODUCTOLOTE
                                                           join als in db.AALMACENSUCURSAL on st.idalmacensucursal equals als.idalmacensucursal
                                                           join p in db.APRODUCTO on st.idproducto equals p.idproducto
                                                           where als.suc_codigo == int.Parse(item) && st.estado == "HABILITADO" && st.candisponible > 0
                                                           && p.idlaboratorio==int.Parse(lab) && p.idtipoproducto == e.tipoproducto
                                                           select st).ToListAsync();
                                        stock.ForEach(x =>
                                        {
                                            x.edicion = x.setedicion("SALIDA", "CerarSTock", "", x.candisponible.ToString());
                                            x.candisponible = 0;
                                            x.iseditable = false;
                                            x.usuariomodifica = e.idusuario;
                                            x.fechaedicion = DateTime.Now;
                                        });
                                        db.UpdateRange(stock);
                                        await db.SaveChangesAsync();
                                    }
                                    
                                }
                                
                            }
                        }
                    }
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
