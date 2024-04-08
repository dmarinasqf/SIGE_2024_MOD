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
    public class VehiculoController : _baseController
    {
        private readonly IVehiculoEF EF;

        public VehiculoController(IVehiculoEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR VEHICULO"))]
        public IActionResult Index()
        {
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR VEHICULO"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(TVehiculo obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        
        public async Task<IActionResult> ListarVehiculosxEmpresa(int? idempresa)
        {
            var data = await EF.ListarVehiculoxEmpresaAsync(idempresa);
            return Json(data);

        }
        public async Task<IActionResult> BuscarVehiculoxId(int? id)
        {
            var data = await EF.BuscarVehiculoxIdAsync(id);
            return Json(data);

        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR VEHICULO"))]
        public async Task<IActionResult> Deshabilitar(int? id)
        {
            return Json(await EF.DeshabilitarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENEDOR VEHICULO"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));
        }
    }
}
