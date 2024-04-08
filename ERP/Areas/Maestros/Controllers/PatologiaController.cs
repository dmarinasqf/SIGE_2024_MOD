using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.PatologiaMascota.query;
using Gdp.Infraestructura.Maestros.PatologiaMascota.command;
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
    public class PatologiaController : _baseController
    {
        
        public PatologiaController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }

        [Authorize(Roles = ("ADMINISTRADOR, MANTENEDOR PATOLOGIA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> ListarPatologia(ListarPatologia.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditar.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
    }
}
