using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Finanzas.EF;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FMonedaController :_baseController
    {
        private readonly IMonedaEF EF;

        public FMonedaController(IMonedaEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
     
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_MONEDA"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_MONEDA"))]
        public async Task<IActionResult> RegistrarEditar(FMoneda obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_MONEDA"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        public async Task<IActionResult> ListarHabilitadosAsync()
        {
            return Json(await EF.ListarHabilitadosAsync());
        }
    }
}