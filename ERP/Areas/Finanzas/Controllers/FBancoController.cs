using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


using Microsoft.AspNetCore.Authorization;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Finanzas;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FBancoController : _baseController
    {
        private readonly IBancoEF EF;

        public FBancoController(IBancoEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_BANCO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_BANCO"))]
        public async Task<IActionResult> RegistrarEditar(FBanco obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_BANCO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));

        }
        public async Task<IActionResult> ListarTipoTarjeta()
        {
            return Json(await EF.ListarTipoTarjetaAsync());

        }
        public async Task<IActionResult> ListarBancosHabilitados()
        {
            return Json(await EF.ListarBancosHabilitadosAsync());
        }
        public async Task<IActionResult> ListarCuentasHabilitados(int idbanco)
        {
            return Json(await EF.ListarCuentasHabilitadosAsync(idbanco));
        }
    }
}