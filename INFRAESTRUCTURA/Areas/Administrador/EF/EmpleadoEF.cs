using ENTIDADES.gdp;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
    public class EmpleadoEF:IEmpleadoEF
    {
        private readonly Modelo db;
        private readonly ApplicationDbContext dbUsuario;
        private readonly UserManager<AppUser> Appuser;
        private readonly RoleManager<AppRol> Approl;

        public EmpleadoEF(Modelo context, UserManager<AppUser> _Appuser, RoleManager<AppRol> _Approl, ApplicationDbContext _dbUsuario)
        {
            db = context;
            Appuser = _Appuser;
            Approl = _Approl;
            dbUsuario = _dbUsuario;
        }
     
        public async Task<EmpleadoModel> ListarModelAsync()
        {
            EmpleadoModel modelo = new EmpleadoModel();
            modelo.sucursales = await db.SUCURSAL.Where(x => x.estado == "HABILITADO").Select(x=> new { idsucursal=x.suc_codigo,x.descripcion}).OrderBy(x => x.descripcion).ToListAsync();
            modelo.grupos = await db.GRUPO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            modelo.canalventas = await db.CANALVENTA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            modelo.cargoempleado = await db.CARGOEMLEADO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            return (modelo);

        }        
        public async Task<List<EMPLEADO>> ListarEmpleadosAsync()
        {
            try
            {
                var query = await (from e in db.EMPLEADO
                             join s in db.SUCURSAL on e.suc_codigo equals s.suc_codigo
                             join g in db.GRUPO on e.idgrupo equals g.idgrupo
                             where e.estado != "ELIMINADO"
                             orderby e.emp_codigo descending
                             select new EMPLEADO
                             {
                                 nombres = e.nombres,
                                 apeMaterno = e.apeMaterno,
                                 apePaterno = e.apePaterno,
                                 documento = e.documento,
                                 userName = e.userName,
                                 clave = e.clave,
                                 local = s.descripcion,
                                 emp_codigo = e.emp_codigo,
                                 grupo = g.descripcion,
                                 email = e.email,
                                 estado=e.estado
                             }).ToListAsync();
                return query;
            }
            catch (Exception )
            {

                return new List<EMPLEADO>();
            }

        }        
        public async Task<EmpleadoPermisoModel> PermisosAsync(int? id)
        {              
            var empleado = getEmpleado(id);
            var areas = await permisosEmpleadoAsync(id.ToString());
            EmpleadoPermisoModel data = new EmpleadoPermisoModel();
            data.empleado = empleado;
            data.areas =  areas;          
            return (data);
        }
        
        public async Task<mensajeJson> AgregarRemoverPermisoAsync(int empleado, string permiso)
        {
            try
            {
                var usuario = await Appuser.FindByIdAsync(empleado.ToString());
                if (await Appuser.IsInRoleAsync(usuario, permiso))
                    await Appuser.RemoveFromRoleAsync(usuario, permiso);
                else
                    await Appuser.AddToRoleAsync(usuario, permiso);
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        
        public async Task<mensajeJson> CrearAsync(EMPLEADO obj)
        {
            try
            {
                using (var transaccion = await db.Database.BeginTransactionAsync())
                {
                    var existe = db.EMPLEADO.Where(x => x.documento == obj.documento).FirstOrDefault();
                    if (existe == null)
                    {
                        if (obj.foto is null) obj.foto="empleado.png";
                        if (obj.idcargo is not null)
                            obj.perfil_codigo = db.CARGOEMLEADO.Find(obj.idcargo).descripcion;
                        db.EMPLEADO.Add(obj);
                        db.SaveChanges();
                        var aux = await metodoCrearUsuarioAsync(obj);
                        if (aux == "ok")
                        {
                            transaccion.Commit();
                            mensajeJson mensaje = new mensajeJson("ok", obj);
                            return (mensaje);
                        }
                        else
                        {
                            transaccion.Rollback();
                            mensajeJson mensaje = new mensajeJson(aux, obj);
                            return (mensaje);
                        }
                    }
                    return (new mensajeJson("Existe un empleado registrado con el mismo documento, podría estar deshabilitado", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }        
        public async Task<mensajeJson> DetalleAsync(int id)
        {
            try
            {
                var obj = await db.EMPLEADO.FindAsync(id);
                obj.CanalVentas =await db.EMPLEADOCANALVENTA.Where(x => x.idempleado == id).Select(x => x.idcanalventa).ToListAsync();
                obj.Sucursales = await db.EMPLEADOSUCURSAL.Where(x => x.idempleado == id).Select(x => x.idsucursal).ToListAsync();
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
   
        public async Task<mensajeJson> EliminarAsync(int id)
        {
            try
            {
                var obj = await db.EMPLEADO.FindAsync(id);
                var usuario = await Appuser.FindByIdAsync(id.ToString());

                if (usuario != null)
                {
                    var remrol = await removerrolesAsync(id);
                    if (remrol.Succeeded)
                    {
                       
                        obj.estado = "DESHABILITADO";
                        db.EMPLEADO.Update(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", null));
                    }
                    return (new mensajeJson("No se pudieron remover los permisos del usuario", null));
                }else
                {
                    obj.estado = "DESHABILITADO";
                    obj.userName = "";
                    obj.clave = "";
                    db.EMPLEADO.Update(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> EditarAsync(EMPLEADO obj)
        {
            try
            {
                using (var transaccion = await db.Database.BeginTransactionAsync())
                {
                    var auxempleado = db.EMPLEADO.Find(obj.emp_codigo);
                    var auxempleado2 = db.EMPLEADO.Where(x => x.documento == obj.documento).FirstOrDefault();
                    if (obj.idcargo is not null)
                        obj.perfil_codigo = db.CARGOEMLEADO.Find(obj.idcargo).descripcion;
                    else
                        obj.perfil_codigo = "";
                    if ((auxempleado2 is null) || (auxempleado.emp_codigo == auxempleado2.emp_codigo))
                    {
                        obj.userName.Trim().Replace(" ", "_");
                        var aux = "ok";
                        if (obj.foto is null)
                            obj.foto = auxempleado.foto;
                        if (obj.foto is null) obj.foto="empleado.png";
                       
                        if (obj.estado=="HABILITADO")
                            aux=await metodoActualizarUsuarioAsync(obj);
                        else
                        {
                            var removerol = await removerrolesAsync(obj.emp_codigo);
                            if (removerol.Succeeded)
                                aux = "ok";
                            else
                                return new mensajeJson("Error al remover los permisos del usuario",null);

                        }
                        if (aux == "ok")
                        {
                            db.EMPLEADO.Update(obj);
                            db.SaveChanges();
                            transaccion.Commit();
                            mensajeJson mensaje = new mensajeJson("ok", obj);
                            return (mensaje);
                        }
                        else
                        {
                            transaccion.Rollback();
                            mensajeJson mensaje = new mensajeJson(aux, obj);
                            return (mensaje);
                        }
                    }
                    else
                        return (new mensajeJson("Existe un registro con el mismo numero de documento", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }

        private async Task<string> metodoCrearUsuarioAsync(EMPLEADO empleado)
        {
            string estadoRegistro = "";
            string email = empleado.userName + "@FreeBrain.com";
            string userName = empleado.userName.Trim().Replace(" ", "_");
            var usuario = await db.APPUSER.FindAsync(empleado.emp_codigo.ToString());
            var usuario2 = await db.APPUSER.Where(x => x.UserName == empleado.userName).FirstOrDefaultAsync();
            
            if (usuario == null && usuario2 == null)
            {
                var user = new AppUser
                {
                    UserName = userName,
                    Email = email,
                    Id = empleado.emp_codigo.ToString(),
                    idSucursal = empleado.suc_codigo.ToString(),
                    sucursal = empleado.local,
                    clave = empleado.clave,
                    nombres = empleado.apePaterno + " " + empleado.apeMaterno + " " + empleado.nombres,
                    grupo = empleado.idgrupo.ToString(),
                    tipoUsuario = "EMPLEADO"
                };
                var result = await Appuser.CreateAsync(user, empleado.clave);
                if (result.Succeeded)
                {
                    estadoRegistro = "ok";
                    var x = await agregarPerfilesAsync(user, empleado.idgrupo);
                }
                else
                { estadoRegistro = result.Errors.ToString(); }
            }
            else
            {
                estadoRegistro = "El nombre de usuario " + empleado.userName + " ya se encuentra registrado";

            }
            return estadoRegistro;
        }
        private async Task<string> agregarPerfilesAsync(AppUser user, int? idgrupo)
        {
            var permisos = db.MODULOGRUPO.Where(x => x.idgrupo == idgrupo).ToList();
            foreach (var item in permisos)
            {
                if(!await Appuser.IsInRoleAsync(user,item.roleid))
                {
                    var newUserRole = await Appuser.AddToRoleAsync(user, item.roleid);
                    if (newUserRole.Succeeded)
                    {

                    }
                }
              
            }
            return "ok";
        }
        private async Task<string> metodoActualizarUsuarioAsync(EMPLEADO empleado)
        {
            var usuario = await Appuser.FindByIdAsync(empleado.emp_codigo.ToString());
            if (usuario != null)
            {
                if (!(usuario.UserName.ToUpper() == empleado.userName.ToUpper()))
                {
                    var x = await Appuser.FindByNameAsync(empleado.userName);
                    if (x != null)
                        return "El nombre de usuario " + empleado.userName + " ya se encuentra registrado";
                }
                //if (!(usuario.grupo == empleado.idgrupo.ToString()))
                //{
                var rolesx = dbUsuario.UserRoles.Where(x => x.UserId == empleado.emp_codigo.ToString()).ToList();
                List<string> roles = new List<string>();
                foreach (var item in rolesx)
                {
                    roles.Add(item.RoleId);
                }
                //var aux1 = await Appuser.RemoveFromRolesAsync(usuario, roles);
                var y = await agregarPerfilesAsync(usuario, empleado.idgrupo);
                //}                
                usuario.UserName = empleado.userName;
                usuario.idSucursal = empleado.suc_codigo.ToString();
                usuario.sucursal = empleado.local;
                usuario.nombres = empleado.apePaterno + " " + empleado.nombres;
                usuario.grupo = empleado.idgrupo.ToString();
                usuario.tipoUsuario = "EMPLEADO";
                var aux3 = await Appuser.ChangePasswordAsync(usuario, usuario.clave, empleado.clave);
                usuario.clave = empleado.clave;
                dbUsuario.APPUSER.Update(usuario);
                dbUsuario.Update(usuario);
                //dbUsuario.SaveChanges();
                return "ok";
            }
            else
                return await metodoCrearUsuarioAsync(empleado);
        }        
        private async Task<IdentityResult> removerrolesAsync(int idempleado)
        {
            var usuario = await Appuser.FindByIdAsync(idempleado.ToString());
            var rolesx = dbUsuario.UserRoles.Where(x => x.UserId == idempleado.ToString()).ToList();
            List<string> roles = new List<string>();
            foreach (var item in rolesx)
            {
                roles.Add(item.RoleId);
            }
            var resp = await Appuser.RemoveFromRolesAsync(usuario, roles);
            if(resp.Succeeded)
            {
                dbUsuario.Users.Remove(usuario);
                await dbUsuario.SaveChangesAsync();
            }
            return resp;
        }
        public  EMPLEADO getEmpleado(int? id)
        {
            try
            {
                var query = (from e in db.EMPLEADO
                             join s in db.SUCURSAL on e.suc_codigo equals s.suc_codigo
                             //join g in db.GRUPO on e.idgrupo equals g.idgrupo
                             where e.emp_codigo == id
                             select new EMPLEADO
                             {
                                 nombres = e.nombres,
                                 apeMaterno = e.apeMaterno,
                                 apePaterno = e.apePaterno,
                                 documento = e.documento,
                                 userName = e.userName,
                                 clave = e.clave,
                                 local = s.descripcion,
                                 emp_codigo = e.emp_codigo,
                                 //grupo = g.descripcion
                             }).FirstOrDefault();
                return query;
            }
            catch (Exception)
            {

                return null;
            }

        }
        public async Task<List<AreaModel>> permisosEmpleadoAsync(string id)
        {
            try
            {
                var usuario = await Appuser.FindByIdAsync(id);
                var permisosUsuario = await Appuser.GetRolesAsync(usuario);
                //var permisos = db.APPROL.ToList();
                List<AppRol> listaroles = new List<AppRol>();
                List<AreaModel> listaAreaPermisos = new List<AreaModel>();
                AreaModel areamodel = new AreaModel();
                var areas = db.GRUPO.Where(x => x.estado != "ELIMINADO").ToList();
                foreach (var item in areas)
                {
                    var x = Approl.Roles.Where(x => x.grupo == item.descripcion).ToList();
                    listaroles = new List<AppRol>();
                    foreach (var item2 in x)
                    {
                        foreach (var item3 in permisosUsuario)
                        {
                            if (item2.Name == item3)
                            {
                                item2.tiene = true;
                                break;
                            }
                        }
                        listaroles.Add(item2);
                    }
                    areamodel = new AreaModel { grupo = item, roles = listaroles };
                    listaAreaPermisos.Add(areamodel);
                }
                return listaAreaPermisos;
            }
            catch (Exception )
            {
                return new List<AreaModel>();
            }


        }
      
        public async Task<List<string>> ListarRolesEmpleadoSinAreaAsync(int idempleado)
        {
            try
            {
                var usuario = await Appuser.FindByIdAsync(idempleado.ToString());
                var permisosUsuario = await Appuser.GetRolesAsync(usuario);
                return permisosUsuario.ToList();
            }
            catch (Exception)
            {
                return new List<string>();
            }
        }
        public mensajeJson GuardarImagen(IFormFile file, int id, string ruta)
        {
            try
            {
                var aux = db.EMPLEADO.Find(id);
                if (file != null)
                {
                    var extension = System.IO.Path.GetExtension(file.FileName);
                    var nombreimagen = id.ToString() + "_" + extension;
                    string respuesta = "";
                    GuardarElementos elemento = new GuardarElementos();
                    respuesta =  elemento.SaveFile(file, ruta, nombreimagen);
                    if (respuesta == "ok")
                    {
                        aux.foto = nombreimagen;
                        aux.iseditable = false;
                        db.Update(aux);
                        db.SaveChanges();
                        return (new mensajeJson("ok", aux));
                    }
                }
                return (new mensajeJson("ok", aux));
            }
            catch (Exception e)
            {

                return (new mensajeJson(e.Message, null));
            }

        }
    }
}
