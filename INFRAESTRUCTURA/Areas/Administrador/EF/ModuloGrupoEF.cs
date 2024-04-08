using ENTIDADES.usuarios;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
   public class ModuloGrupoEF:IModuloGrupoEF
    {
        private readonly Modelo db;
        private readonly RoleManager<AppRol> Approl;
        public ModuloGrupoEF(Modelo context, RoleManager<AppRol> _Approl)
        {
            db = context;
            Approl = _Approl;
        }
     
        public async Task<List<Grupo>> ListarGruposAsync()
        {                     
            return (await db.GRUPO.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        
        public async Task<mensajeJson> RegistrarEditarAsync(Grupo obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.GRUPO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idgrupo == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", aux));
                        }
                        else
                            return (new mensajeJson("El registro ya existe", null));

                    }
                }
                else
                {
                    if (aux is null)
                    {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.idgrupo == obj.idgrupo)
                        {
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        else
                            return (new mensajeJson("El registro ya existe", null));
                    }
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.GRUPO.FirstOrDefaultAsync(m => m.idgrupo == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<List<AppRol>> ListarRolesAsync()
        {
            var roles = await Approl.Roles.OrderBy(x => x.grupo).ToListAsync();
            return roles;
        }
        public async Task<List<ModulosGrupo>> RolesDeGrupoAsync(int grupo)
        {

            var data = await db.MODULOGRUPO.Where(x => x.idgrupo == grupo).ToListAsync();
            return (data);
        }
        public async Task<mensajeJson> AgregarRemoverPermisoAsync(int grupo, string permiso)
        {
            try
            {
                var roles = await db.MODULOGRUPO.Where(x => x.idgrupo == grupo && x.roleid == permiso).ToListAsync();
                if (roles.Count != 0)
                {
                    db.MODULOGRUPO.RemoveRange(roles);
                    await db.SaveChangesAsync();
                }
                else
                {

                    ModulosGrupo modulo = new ModulosGrupo()
                    {
                        idgrupo = grupo,
                        roleid = permiso
                    };
                    await db.MODULOGRUPO.AddAsync(modulo);
                    await db.SaveChangesAsync();
                }
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
    }
}
