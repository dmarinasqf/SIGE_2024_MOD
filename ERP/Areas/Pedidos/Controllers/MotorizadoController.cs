using DinkToPdf.Contracts;
using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Pedido.DAO;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Gdp.Infraestructura.Delivery.Asignacion.query;
using Gdp.Infraestructura.Delivery.Motorizado.command;
using Gdp.Infraestructura.Delivery.Motorizado.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class MotorizadoController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly MotorizadoDAO _motorizadoDAO;
        private readonly IConverter _pdf;

        public MotorizadoController(IWebHostEnvironment _ruta, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, IConverter pdf) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new();
            ruta = _ruta;
            _motorizadoDAO = new MotorizadoDAO(settings.GetConnectionString()); ;
            _pdf = pdf;
        }
        [Authorize(Roles = "MOTORIZADO, JEFE_MOTORIZADO, ADMINISTRADOR")]
        public async Task<IActionResult> PedidosPorEntregar(ListarPedidosParaEntregar.EjecutarData obj)
        {
            datosinicio();
            obj.idempleado = getIdEmpleado().ToString();
            var data = await _mediator.Send(obj);
            return View(data);
        }
        [Authorize(Roles = "MOTORIZADO, JEFE_MOTORIZADO, ADMINISTRADOR")]
        public IActionResult RecepcionarPedidos()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "MOTORIZADO, JEFE_MOTORIZADO, ADMINISTRADOR")]
        public IActionResult EnRutaPedidos()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "MOTORIZADO, JEFE_MOTORIZADO, ADMINISTRADOR")]
        public IActionResult ReporteGeneral()
        {
            datosinicio();
            return View("Reporte/ReporteGeneral");
        }

        public async Task<IActionResult> ListarPedidosPorUsuario(ListarPedidosPorUsuario.EjecutarData obj)
        {
            obj.empleado = getIdEmpleado().ToString();
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> CambiarEstadoEntregaDelivery(CambiarEstadoEntregaDelivery.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPedidoEntrega(BuscarPedidoEntrega.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> RegistrarEntregaPedido(RegistrarEntregaPedido.Ejecutar data)
        {
            data.ruta = ruta.WebRootPath;
            return Json(await _mediator.Send(data));
        }

        [HttpPost]
        public IActionResult ReporteGeneral(string sucursal, string fecha)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();

            var reporteGeneral = _motorizadoDAO.ReporteGeneral(sucursal, fecha);
            return Json(JsonConvert.SerializeObject(reporteGeneral));
        }

        [HttpPost]
        public async Task<IActionResult> GenerarExcelReporteGeneral(string sucursal, string fecha)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();

            var reporteExcel = await _motorizadoDAO.GenerarExcelStockAsync(ruta.WebRootPath);
            return Json(reporteExcel);
        }

        public IActionResult ImprimirReporteGeneral(string sucursal, string fecha)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();

            var reporteGeneral = _motorizadoDAO.ReporteGeneral(sucursal, fecha);
            return View(reporteGeneral);
        }

        [HttpPost]
        public IActionResult GenerarPdfReporteGeneral(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "ReporteGeneral", "vertical");
                var file = _pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public IActionResult GenerarPdfReporteGeneral(string sucursal, string fecha)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();
            var data = _motorizadoDAO.ReporteGeneral(sucursal, fecha);
            mensajeJson oMensaje = new mensajeJson();
            oMensaje.objeto = JsonConvert.SerializeObject(data);
            oMensaje.mensaje = "ok";
            return View(oMensaje);
        }
    }
}
