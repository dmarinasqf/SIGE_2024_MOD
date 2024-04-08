using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.command;
using Erp.Infraestructura.Areas.Finanzas.Deposito.ValidarDeposito.query;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FPagosController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public FPagosController(IWebHostEnvironment ruta_,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = ruta_;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ValidarDeposito()
        {
            datosinicio();
            return View();
        }

        public IActionResult ReporteDeposito()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> ListarDepositosAprobar(ReporteDeposito.Ejecutar obj)
        {
            var data = await _mediator.Send(obj);
            return Json(data);
        }

        public async Task<IActionResult> AprobarPago(AprobarPago.Ejecutar obj)
        {
            obj.UsuarioAprueba = getIdEmpleado().ToString();
            var data = await _mediator.Send(obj);
            return Json(data);
        }

        public async Task<IActionResult> ActualizarPago(ActualizarPago.Ejecutar obj)
        {
            var data = await _mediator.Send(obj);
            return Json(data);
        }

        public async Task<IActionResult> ReportePagos(ReporteDeposito.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            var data = await _mediator.Send(obj);
            return Json(data);
        }

    }
}
