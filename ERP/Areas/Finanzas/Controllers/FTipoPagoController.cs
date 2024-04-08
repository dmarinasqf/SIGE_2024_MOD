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
using Erp.Persistencia.Modelos;
using ENTIDADES.Almacen;
using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FTipoPagoController : _baseController
    {
        private readonly ITipoPagoEF EF;

        public FTipoPagoController(ITipoPagoEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }      
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_TIPOPAGO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_TIPOPAGO"))]
        public async Task<IActionResult> RegistrarEditar(FTipoPago obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_TIPOPAGO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        public async Task<IActionResult> ListarHabilitados()
        {
            return Json(await EF.ListarHabilitadosAsync());
        }
    }
}