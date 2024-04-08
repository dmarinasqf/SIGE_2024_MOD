using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace Erp.AppWeb.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class EspecialidadController : _baseController
    {
        public EspecialidadController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }

        public async Task<IActionResult> ListarEspecialidad(ListarEspecialidad.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));

        }
    }
}
