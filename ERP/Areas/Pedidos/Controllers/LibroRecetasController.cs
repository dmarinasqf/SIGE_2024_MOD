using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.LibroReceta.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class LibroRecetasController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public LibroRecetasController(IWebHostEnvironment ruta_,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = ruta_;
        }
        [Authorize(Roles = "ADMINISTRADOR, VISTA_LIBRORECTAS")]
        public IActionResult ReporteLibro()
        {
            datosinicio();
            return View();
        }
      
        public async Task<IActionResult> GetLibro(Reporte.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator .Send(obj));
        }
       
    }
  
}
