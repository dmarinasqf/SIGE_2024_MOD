using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;

using Microsoft.AspNetCore.Authorization;
using ENTIDADES.Almacen;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AAccionFarmacologicaController : _baseController
    {
        private readonly IAccionFarmacologicaEF EF;
        public AAccionFarmacologicaController(IAccionFarmacologicaEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }      
        [Authorize (Roles =("ADMINISTRADOR,M_ALMACEN_ACCION_FARMACOLOGICA"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ACCION_FARMACOLOGICA"))]
        public async Task<IActionResult> RegistrarEditar(AAccionFarmacologica obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
            
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ACCION_FARMACOLOGICA"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));

        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ACCION_FARMACOLOGICA"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));

        }
        public async Task<IActionResult> ListarAccionesFarma()
        {
            return Json(await EF.ListarAccionesFarmaHabilitadasAsync());
        }
    }
}
