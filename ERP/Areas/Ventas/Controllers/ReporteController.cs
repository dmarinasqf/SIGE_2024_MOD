using ERP.Controllers;
using ERP.Models.Ayudas;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vinali.Infraestructura.Ventas.command;
using Vinali.Infraestructura.Ventas.query;
using Erp.Infraestructura.Areas.Ventas.incentivos.query;

namespace ERP.Areas.Ventas
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly LeerJson settings = new LeerJson();
        public ReporteController(IWebHostEnvironment ruta_, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
        }
        [Authorize(Roles = "ADMINISTRADOR, REPORTE DE INCENTIVOS")]
        public IActionResult ReporteIncentivos()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REPORTE DE VENTAS")]
        public IActionResult ReporteVentas()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REPORTE DE VENTAS")]
        public IActionResult ReporteVentasVinali()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REPORTE DE NOTAS CD")]
        public IActionResult ReporteNotas()
        {
            datosinicio();
            return View();
        }

        // se agrego para apuntar a reprte caja -----YEX
        public IActionResult ReporteCierreCaja()
        {
            datosinicio();
            return View();
        }
        [HttpPost]
        public IActionResult GetReporteIncentivos(string empleado, string fechainicio, string fechafin, int top)
        {
            ReporteVentasDao dao = new ReporteVentasDao(settings.GetConnectionString());
            var data = dao.GetReporteIncentivos(empleado, fechainicio, fechafin, top);
            return Json(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public async Task<IActionResult> GenerarExcelIncentivos(string empleado, string fechainicio, string fechafin, int top)
        {
            ReporteVentasDao dao = new ReporteVentasDao(settings.GetConnectionString());
            return Json(await dao.GenerarExcelIncentivosAsync(empleado, fechainicio, fechafin, top, ruta.WebRootPath));
        }
        [HttpPost]
        public async Task<IActionResult> GetReporteVentas(int top, string sucursal, string fechainicio, string fechafin, string cliente, string tipoplantilla, string documentos)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();
            string divisor = "|";
            string[] sedes = sucursal.Split(divisor);
            string[] docs = documentos.Split(divisor);
            ReporteVentasDao dao = new ReporteVentasDao(settings.GetConnectionString());
            
            var data = await dao.GetReporteVentas(top, sucursal, fechainicio, fechafin, cliente, tipoplantilla, documentos);
            
            return Json(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public async Task<IActionResult> GenerarExcelreporteVentas(int top, string sucursal, string fechainicio, string fechafin, string cliente, string tipoplantilla, string documentos)
        {
            ReporteVentasDao dao = new ReporteVentasDao(settings.GetConnectionString());
            return Json(await dao.GenerarExcelReporteVentas(top, sucursal, fechainicio, fechafin, cliente, tipoplantilla, documentos, ruta.WebRootPath));

        }
        [HttpPost]
        public async Task<IActionResult> GetReporteVentasVinali(ReporteVentasVinali.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        [HttpPost]
        public async Task<IActionResult> GenerarExcelreporteVentasVinali(GenerarExcelVentasVinali.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        [HttpPost]
        public async Task<IActionResult> ReporteIncentivosDetallado(ReporteIncentivosDetallado.Ejecutar obj)
        {
            if (obj.empleados is null)
                obj.empleados = getdocumentoempleado();
            if(obj.sucursales is null)
                obj.sucursales = getIdSucursal().ToString();
            return Json(await _mediator.Send(obj));
        }

        [HttpPost]
        public async Task<IActionResult> DescargarExcelReporteIncentivoDetallado(DescargarExcelReporteIncentivoDetallado.Ejecutar obj)
        {
            if (obj.empleados is null)
                obj.empleados = getdocumentoempleado();
            if (obj.sucursales is null)
                obj.sucursales = getIdSucursal().ToString();
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
    }
}
