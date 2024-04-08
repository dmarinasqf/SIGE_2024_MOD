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
using VisitadorMedico.Infraestructura.RelacionMedRepMedico.command;
using VisitadorMedico.Infraestructura.RelacionMedRepMedico.query;

namespace Erp.AppWeb.Areas.VisitadorMedico.Controllers
{
    [Area("VisitadorMedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class MedicoRepresentanteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public MedicoRepresentanteController(ICryptografhy crytografhy, SignInManager<AppUser> signInManager, IWebHostEnvironment ruta_) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
        }
        [Authorize(Roles = "ADMINISTRADOR,REP.MEDICO")]
        public IActionResult Asignacion()
        {
            datosinicio();
            return View();
        }

        public IActionResult AsignacionCliente()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> ListarMedicosRepMedico(ListarMedicosDeRepMedico.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarCanalVentaMedicoRepMedico(ListarCanalVentaMedicoRepMedico.Ejecutar obj)
        {            
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarRepresentatesDeUnMedico(BuscarRepresentatesDeUnMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AgregarMedicoRepMedico(AgregarMedicoRepMedico.Ejecutar obj)
        {            
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> DeshabilitarMedicoRepMedico(DeshabilitarMedicoRepMedico.Ejecutar obj)
        {            
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> ListarCanalVentaClienteRepMedico(ListarCanalVentaClienteRepMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarClientesRepMedico(ListarClientesDeRepMedico.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AgregarClienteRepMedico(AgregarClienteRepMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> DeshabilitarClienteRepMedico(DeshabilitarClienteRepMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }     
}
