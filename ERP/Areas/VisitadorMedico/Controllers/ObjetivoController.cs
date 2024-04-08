using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitadorMedico.Infraestructura.Maestros.objetivos;

namespace Erp.AppWeb.Areas.VisitadorMedico.Controllers
{
    [Area("VisitadorMedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ObjetivoController : _baseController
    {
        public ObjetivoController( ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
           
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO")]
        public IActionResult MaestroObjetivos()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO")]
        public async Task<IActionResult> RegistrarEditar(RegistrarEditar.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO")]
        public async Task<IActionResult> ElimnarObjetivo(ElimnarObjetivo.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarObjetivos(ListarObjetivos.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        
    }
}
