using ENTIDADES.Almacen;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class APrincipioActivoController : _baseController
    {
        private readonly IPrincipioActivoEF EF;
        public APrincipioActivoController(IPrincipioActivoEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        [Authorize(Roles = "ADMINISTRADOR, M_ALMACEN_PRODUCTO")]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = "ADMINISTRADOR, M_ALMACEN_PRODUCTO")]
        public async Task<IActionResult> RegistrarEditar(APrincipioActivo obj)
        {
            
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        public IActionResult BuscarRegistros(string filtro, int top)
        {
            
            return Json(EF.BuscarRegistros(filtro,top));
        }
    }
}
