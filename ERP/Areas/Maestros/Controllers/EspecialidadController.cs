using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.especialidad.NewFolder;
using Gdp.Infraestructura.Maestros.especialidad.query;
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
    public class EspecialidadController : _baseController
    {
        public EspecialidadController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }
        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR,REP.MEDICO, MANTENEDOR_ESPECIALIDADES")]
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> getListar(ListarEspecialidad.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditarEspecialidad.Ejecutar data)
        {
            return Json(await _mediator.Send(data));

        }

    }
}
