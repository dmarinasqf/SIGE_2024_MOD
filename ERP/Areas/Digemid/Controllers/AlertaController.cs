using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Digemid.alertadigemid.command;
using Erp.Infraestructura.Areas.Digemid.alertadigemid.query;
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

namespace ERP.Areas.Digemid.Controllers
{
    [Area("Digemid")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AlertaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        

        public AlertaController(IWebHostEnvironment _webHostEnvironment, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = _webHostEnvironment;         
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, MODULO DE DIGEMID")]
        public async Task<IActionResult> RegistrarEditarAlerta(RegistrarEditarAlerta.Ejecutar obj)
        {
            obj.ruta = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarAlertas(ListarAlertas.Ejecutar obj)
        {          
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarAlerta(BuscarAlerta.Ejecutar obj)
        {          
            return Json(await _mediator.Send(obj));
        }
    }
}
