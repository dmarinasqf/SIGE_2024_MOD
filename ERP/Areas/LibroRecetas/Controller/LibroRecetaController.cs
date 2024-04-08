using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.LibroReceta.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.LibroRecetas.Controller
{
    [Area("LibroRecetas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class LibroRecetaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;

        public LibroRecetaController(IWebHostEnvironment _webHostEnvironment, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = _webHostEnvironment;
        }


        public async Task<IActionResult> GetCodigoLibroRecetas(CodigoLibroReceta.Ejecutar obj)
        {
            var data = await _mediator.Send(obj);
            return Json(data);
        }
    }
}
