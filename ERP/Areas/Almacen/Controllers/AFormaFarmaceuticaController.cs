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
    public class AFormaFarmaceuticaController : _baseController
    {
        private readonly IFormaFarmaceuticaEF EF;

        public AFormaFarmaceuticaController(IFormaFarmaceuticaEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        [Authorize(Roles = ("ADMINISTRADOR, MAESTRO FORMA FARMACEUTICA"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, MAESTRO FORMA FARMACEUTICA"))]
        public async Task<IActionResult> RegistrarEditar(AFormaFarmaceutica obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }       
    }
}
 