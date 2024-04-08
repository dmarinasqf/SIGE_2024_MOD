using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.instituciones.query;
using Gdp.Infraestructura.Maestros.instituciones.command;
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
    public class InstitucionController : _baseController
    {
        public InstitucionController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }

        [Authorize(Roles = "ADMINISTRADOR, MANTENEDOR_MEDICO")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }


        public async Task<IActionResult> getListado(ListarInstituciones.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditarInstitucion.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
    }
}
