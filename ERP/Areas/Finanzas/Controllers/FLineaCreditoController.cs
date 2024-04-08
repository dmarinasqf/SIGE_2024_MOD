using ENTIDADES.finanzas;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Finanzas.LineaCredito;
using INFRAESTRUCTURA.Areas.Finanzas.LineaCredito.DocumentosPorCobrar;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
    public class FLineaCreditoController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public FLineaCreditoController(IWebHostEnvironment ruta_,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = ruta_;
        }
        [Authorize(Roles = "REGISTRO DE LINEA CREDITO, ADMINISTRADOR")]
        public async Task<IActionResult> AsignarLineaCreditoAsync()
        {
            var datainicio = await _mediator.Send(new DatosInicio.Ejecutar());
            ViewBag.monedas = datainicio.monedas;
            ViewBag.condicionpagos = datainicio.condicionpagos;
            datosinicio();
            return View();
        }
        [Authorize(Roles = "DOCUMENTOS POR COBRAR CLIENTE, ADMINISTRADOR")]
        public  IActionResult DocumentosPorCobrar(int? idcliente)
        {
            
            datosinicio();
            return View(idcliente);
        }
        public async Task<IActionResult>BuscarLineaCliente(BuscarCreditoCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult>RegistrarEditarCredito(FLineaCredito obj)
        {
            return Json(await _mediator.Send(new RegistrarEditarCredito.Ejecutar { lineacredito=obj}));
        }
        public async Task<IActionResult>HistorialCreditoCliente(ListarCreditosCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarDocumentosPorCobrar(ListarDocPorCobrar.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarPagosDocumentos(RegistrarPago.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ExcelPagosDocumentos(GenerarExcelDocCobrar.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
