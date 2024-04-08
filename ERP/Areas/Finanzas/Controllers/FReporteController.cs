using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Finanzas.reporte;
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

namespace ERP.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public FReporteController( ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, IWebHostEnvironment ruta_) : base(cryptografhy, signInManager)
        {
            ruta = ruta_;
        }
        public IActionResult InterfazStartSoft()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> ConsultarInterfazStartSoft(ReporteStartSoftVentasTxt.Ejecutar obj)
        {

            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
