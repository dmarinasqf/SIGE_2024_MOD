using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Pedidos.pagos;
using Gdp.Infraestructura.Pedidos.pagos.command;
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
    public class DepositosController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public DepositosController(IWebHostEnvironment ruta_, ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
            ruta = ruta_;
        }
        [Authorize(Roles = "ADMINISTRADOR, VISTA DEPOSITOS, REPORTE DEPOSITOS")]
        public IActionResult Reporte()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, VISTA DEPOSITOS,  VALIDAR DEPOSITOS")]
        public IActionResult ValidarDepositos()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> GetListaDepositoAprobado(ListarDepositosAprobar.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> SetEditar(Editar.Ejecutar obj)
        {
            //obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> SetEditarValido(EditarValido.Ejecutar obj)
        {
            //obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
