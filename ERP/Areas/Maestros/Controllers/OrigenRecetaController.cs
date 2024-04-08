using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.OrigenReceta;
using Gdp.Infraestructura.Maestros.OrigenReceta.query;
using Gdp.Infraestructura.Maestros.OrigenReceta.command;
using Gdp.Infraestructura.Maestros.tipoOrigenReceta.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class OrigenRecetaController : _baseController
    {
        public OrigenRecetaController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
           
        }
        public async Task<IActionResult> BuscarOrigenReceta(BuscarOrigenReceta.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        [Authorize(Roles = ("ADMINISTRADOR, MANTENEDOR ORIGEN RECETA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> BuscarORId(BuscarOrigenRecetaId.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> ListarTipoOrigenReceta(ListarTipoOrigenReceta.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> RegistrarEditar(RegistrarEditar.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
    }
}
