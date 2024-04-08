using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.RazaMascota.query;
using Gdp.Infraestructura.Maestros.RazaMascota.command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class RazaController : _baseController
    {
        public RazaController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }

        [Authorize(Roles = ("ADMINISTRADOR, MANTENEDOR RAZA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> ListarAgencias(ListarRazaMascota.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditarRaza.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
    }
}
