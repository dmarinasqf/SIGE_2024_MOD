using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace Erp.AppWeb.Areas.VisitadorMedico.Controllers
{
    [Area("VisitadorMedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public ReporteController(IWebHostEnvironment ruta_, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
        }
        public IActionResult HorariosVisitadores()
        {
            datosinicio();
            return View();
        }
        public IActionResult FormulasXMedico()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "LABORATORIO, ADMINISTRADOR, SUPERVISOR,REP.MEDICO, VENTAS, VENTASSM")]
        public IActionResult Consultar()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> GetReporteHorariosVisitadores(ReporteVisitaMedica.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteFormulasXMedico(ReporteFMMedicos.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
