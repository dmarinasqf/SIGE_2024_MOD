using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.colegiomedico;
using Gdp.Infraestructura.Maestros.colegiomedico.NewFolder;
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
    public class ColegioMedicoController : _baseController
    {
        public ColegioMedicoController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {

        }
        [Authorize(Roles = ("ADMINISTRADOR"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> ListarColegios()
        {
            return Json(await _mediator.Send(new ListarColegioMedico.Ejecutar()));
        }
        public async Task<IActionResult> getListarColegios(ListarColegio.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditar.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
    }
}
