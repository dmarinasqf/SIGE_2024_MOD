using ENTIDADES.gdp;
using ENTIDADES.Generales;
using ERP.Controllers;
using ERP.Models;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.Linq;
using System.Threading.Tasks;

using ENTIDADES.Identity;
namespace ERP.Areas.Administrador.Controllers
{
    [Authorize]
    [Area("Administrador")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class LugarSucursalController : _baseController
    {
        private readonly ILugarSucursalEF EF;        
        public LugarSucursalController(ILugarSucursalEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;            
        }       
        
        [Authorize(Roles = ("ADMINISTRADOR, M_LUGAR_SUCURSAL"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_LUGAR_SUCURSAL"))]
        public async Task<IActionResult> RegistrarEditar(LugarSucursal obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_LUGAR_SUCURSAL"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
    }
}