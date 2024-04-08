using ENTIDADES.Generales;
using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Maestros.paciente.mantenimiento;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PacienteController : _baseController
    {
        public PacienteController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
           
        }
        public async Task<IActionResult> RegistrarEditar(Paciente paciente)
        {
            return Json(await _mediator.Send(new RegistrarEditarPaciente.Ejecutar { paciente=paciente}));
        }
        public async Task<IActionResult> BuscarxDocumento(BuscarPacienteByDocumento.Ejecutar obj)
        {
            return Json(JsonConvert.SerializeObject(await _mediator.Send(obj)));
        }
        public async Task<IActionResult> BuscarPacientesByNumDocumento(BuscarPacientesByNumDocumento.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPacientes(BuscarPacientes.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPacienteById(BuscarPacienteById.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}
