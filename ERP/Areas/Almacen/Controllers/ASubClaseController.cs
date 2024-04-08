using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
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
    public class ASubClaseController : _baseController
    {       
        private readonly ISubClaseEF EF;

        public ASubClaseController(ISubClaseEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {          
            EF = _EF;
        }
      
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_SUBCLASE"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var modelo = await EF.listarViewModelAsync();
            ViewBag.clases =modelo.clases;
            var data = await EF.listarSubclasesAsync();
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_SUBCLASE"))]
        public async Task<IActionResult> RegistrarEditar(ASubClase obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_SUBCLASE"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }

        public async Task<IActionResult> listarSubclase(int? id)
        {
            return Json(await EF.listarSubclasesHabilitadasAsync(id));

        }
    }
}