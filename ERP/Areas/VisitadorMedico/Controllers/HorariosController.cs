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
using VisitadorMedico.Infraestructura.VisitaMedica.comand;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace Erp.AppWeb.Areas.VisitadorMedico.Controllers
{
    [Area("VisitadorMedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class HorariosController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public HorariosController(IWebHostEnvironment ruta,ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
            this.ruta = ruta;
        }

        [Authorize(Roles = "LABORATORIO, ADMINISTRADOR, SUPERVISOR,REP.MEDICO, VENTAS, VENTASSM")]
        public IActionResult AsignarMedicos()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> GetHorariosxMedicosxSucursal(ListarHorarioxMedicoxSucursalh.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GeListarHorarioConsultorioxDia(ListarHorarioConsultorioxDia.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> setHorario(RegistrarEditarHorario.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> DeleteHorario(EliminarHorario.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> getRegistrosMedicoxDia(ListarMedicoRegistrosxDia.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}
