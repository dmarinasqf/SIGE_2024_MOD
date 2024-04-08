using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AFabricanteController : _baseController
    {
        private readonly IFabricanteEF EF;

        public AFabricanteController(IFabricanteEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
      
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_FABRICANTE"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_FABRICANTE"))]
        public async Task<IActionResult> RegistrarEditar(AFabricante obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_FABRICANTE"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));


        }
    }
}