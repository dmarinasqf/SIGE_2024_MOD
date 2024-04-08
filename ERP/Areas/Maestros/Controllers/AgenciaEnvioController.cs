using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.agenciaenvio.command;
using Gdp.Infraestructura.Maestros.agenciaenvio.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AgenciaEnvioController : _baseController
    {

        public AgenciaEnvioController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
           
        }
       

        [Authorize(Roles = ("ADMINISTRADOR, MANTENEDOR_AGENCIA_ENCOMIENDA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }


        public async Task<IActionResult> RegistrarEditar(RegistrarEditarAgencia.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> ListarAgencias(ListarAgenciaEnvio.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}
