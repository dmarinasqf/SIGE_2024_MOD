using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.dificultadformula.query;
using Gdp.Infraestructura.Maestros.dificultadformula.command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class DificultadFormulaController : _baseController
    {

        public DificultadFormulaController(IWebHostEnvironment _webHostEnvironment, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        { }

        [Authorize(Roles = ("ADMINISTRADOR, MANTENEDOR DIFICULTAD FORMULA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }


        public async Task<IActionResult> ListarDificultadFormula(ListarDificultad.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditarDificultadF.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }

    }
}
