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
using Vinali.Infraestructura.Ventas.query;

namespace ERP.Areas.Vinali.Controllers
{
    [Area("Vinali")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class VinaliController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public VinaliController(IWebHostEnvironment ruta_,ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
        }
        public IActionResult ReporteVentas()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> GetReporteVentas(HistorialVentas.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
