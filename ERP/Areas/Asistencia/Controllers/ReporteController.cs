using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Asistencia.reporte;
using Gdp.Infraestructura.Pedidos.reportes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Asistencia.Controllers
{
    [Area("Asistencia")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public ReporteController(IWebHostEnvironment ruta_, ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
            ruta = ruta_;
        }


        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR,REPORTE ASISTENCIA Y TEMPERATURA")]
        public ActionResult ReporteAsistencias()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR,REPORTE ASISTENCIA Y TEMPERATURA")]
        public ActionResult RMensual()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR,REPORTE ASISTENCIA Y TEMPERATURA")]
        public async Task<IActionResult> Reportegeneral()
        {
            var inicio = await _mediator.Send(new DatosInicio.Ejecutar());
            ViewBag.empresas = inicio.empresas;
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR,REPORTE ASISTENCIA Y TEMPERATURA")]
        public ActionResult ReporteTemperatura()
        {
            datosinicio();
            return View();
        }


        public async Task<IActionResult> GetReporteDiarioIndividual(ReporteDiarioIndividual.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetAsistenciaLista(GetAsistencia.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteTemperatura(GetReporteTemperatura.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
