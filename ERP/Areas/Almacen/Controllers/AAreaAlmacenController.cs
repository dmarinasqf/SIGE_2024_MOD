using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ENTIDADES.Almacen;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
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
    public class AAreaAlmacenController : _baseController
    {
        private readonly IAreaAlmacenEF EF;
        public AAreaAlmacenController(IAreaAlmacenEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
     
      
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_AREAALMACEN"))]
        public async Task<IActionResult>  Index()
        {
            datosinicio();
            var data = await EF.ListarAsync();            
            return View(data);
          
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_AREA_ALMACEN"))]
        public async Task<IActionResult> RegistrarEditar(AAreaAlmacen obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_AREA_ALMACEN"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));

        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_AREA_ALMACEN"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));

        }


    }

}