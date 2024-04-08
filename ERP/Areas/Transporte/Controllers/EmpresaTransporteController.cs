using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Transporte;
using ERP.Controllers;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Transporte.EF;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Areas.Transporte.Controllers
{
    [Area("Transporte")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class EmpresaTransporteController : _baseController
    {
        private readonly IEmpresaTransporteEF EF;

        public EmpresaTransporteController(IEmpresaTransporteEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR TRANSPORTE"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View( await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR EMPRESA TRANSPORTE"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(TEmpresa obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR EMPRESA TRANSPORTE"))]
        public async Task<IActionResult> Deshabilitar(int? id)
        {
            return Json(await EF.DeshabilitarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR EMPRESA TRANSPORTE"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));
        }
        public async Task<IActionResult> ListarEmpresasTransporte()
        {
                var data = await EF.ListarHabilitadosAsync();
                return Json(new mensajeJson("ok", data));
            
        }
    }
}
