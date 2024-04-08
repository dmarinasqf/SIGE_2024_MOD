using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitadorMedico.Infraestructura.VisitaMedica.comand;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace Erp.AppWeb.Areas.VisitadorMedico.Controllers
{
    [Area("VisitadorMedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class VisitaMedicaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly Modelo db;
        public VisitaMedicaController(ICryptografhy crytografhy, Modelo db_, SignInManager<AppUser> signInManager, IWebHostEnvironment ruta_) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
            db = db_;
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO, MANTENEDOR VISITA MEDICA")]

        public IActionResult Mantenimiento()
        {
            ViewBag.Turnos = db.TURNO.Where(x => x.descripcion != "Todo el día").ToList();
            datosinicio();
            return View();
        }
        public async Task<IActionResult> ListarVisitasMedicas(ListarVisitasMedicas.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarRegistrosConsultorioxDia(ListarRegistrosConsultorioxDia.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO, MANTENEDOR VISITA MEDICA")]
        public async Task<IActionResult> RegistrarEditarVisita(RegistrarEditarVisita.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EliminarVisita(EliminarVisita.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}
