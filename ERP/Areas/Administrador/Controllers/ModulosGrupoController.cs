using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.usuarios;
using ERP.Models;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Identity;

using Erp.Persistencia.Modelos;
using ENTIDADES.Identity;
using ERP.Controllers;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Servicios;

namespace ERP.Areas.Administrador.Controllers
{
    [Authorize]
    [Area("Administrador")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ModulosGrupoController : _baseController
    {
        private readonly IModuloGrupoEF EF;
     
        public ModulosGrupoController(IModuloGrupoEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;          
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, M_USUARIOS_GRUPO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            ViewBag.roles = await EF.ListarRolesAsync();
            return View(await EF.ListarGruposAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_USUARIOS_GRUPO"))]
        public async Task<IActionResult> RegistrarEditar(Grupo obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_USUARIOS_GRUPO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }      
        public async Task<IActionResult> RolesDeGrupo(int grupo)
        {

            return Json(await EF.RolesDeGrupoAsync(grupo));
        }
        public async Task<IActionResult> ListarRoles()
        {
            return Json(await EF.ListarRolesAsync());
        }
       public async Task<IActionResult> ListarGrupos()
        {
            return Json(await EF.ListarGruposAsync());
        }
    
        public async Task<IActionResult> AgregarRemoverPermiso(int grupo, string permiso)
        {
            return Json(await EF.AgregarRemoverPermisoAsync(grupo,permiso));
        }
    }
}
