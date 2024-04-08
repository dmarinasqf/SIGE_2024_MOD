using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Compras.DAO;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CReporteController: _baseController
    {
        private readonly Modelo db;
        //private readonly IProveedorEF EF;
        private readonly ReporteCompraDAO DAO;
        private readonly IUser user;
        private readonly IWebHostEnvironment ruta;

        public CReporteController(IWebHostEnvironment ruta_,IUser _user, Modelo context, /*IProveedorEF _EF,*/ ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            //EF = _EF;
            ruta = ruta_;
            user = _user;
            LeerJson settings = new LeerJson();
            DAO = new ReporteCompraDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR, DEVOLUCION PROVEEDOR"))]
        public IActionResult DevolucionProveedor()
        {
            datosinicio();
            return View();
        }
        public IActionResult ComprasRango() {
            datosinicio();
            return View();
        }
        public IActionResult ProductosxVencer() {
            datosinicio();
            return View();
        }
        public IActionResult NegociacionRango() {
            datosinicio();
            return View();
        }
        public IActionResult OCEmitidas() {
            datosinicio();
            return View();
        }
        public IActionResult EntregaxProveedor() {
            datosinicio();
            return View();
        }
        public IActionResult ComprasDetallada() {
            datosinicio();
            return View();
        }
        public IActionResult DistribucionLocales() {
            datosinicio();
            return View();
        }
        public IActionResult Distribuciondetallado() {
            datosinicio();
            return View();
        }
        public IActionResult ReporteDevolucion(string idproveedor, string fecha)
        {
            //int idempresa = user.getIdEmpresaCookie();
            var data = DAO.ReporteDevolucion(idproveedor, fecha);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelDevolucionProveedor(int proveedor)
        {
            var data = await DAO.GenerarExcelDevolucionProveedor(proveedor, ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ReporteCompras(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteCompras(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelCompras(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            return Json(await DAO.GenerarExcelComprasAsync(fechainicio, fechafin, ruta.WebRootPath));
        }
        public IActionResult ReporteProductosxVencer(int num_dias, string suc_codigo) {
            //int idempresa = user.getIdEmpresaCookie();
            var data = DAO.ReporteProductosxVencer(num_dias, suc_codigo);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelProductosxVencer(string suc_codigo) {
            var data = await DAO.GenerarExcelProductosxVencer(suc_codigo, ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ReporteNegociacionCompras(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteNegociacionCompras(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReporteNegociacionCompras(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = await DAO.GenerarExcelReporteNegociacionCompras(fechainicio, fechafin, ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ReporteOCEmitidas(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteOCEmitidas(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReporteOCEmitidas(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = await DAO.GenerarExcelReporteOCEmitidas(fechainicio, fechafin, ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ReporteEntregaxProveedor(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteEntregaxProveedor(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReporteEntregaxProveedor(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = await DAO.GenerarExcelReporteEntregaxProveedor(fechainicio, fechafin, ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ReporteComprasDetallada(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteComprasDetallada(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelComprasDetallada(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            return Json(await DAO.GenerarExcelComprasDetalladaAsync(fechainicio, fechafin, ruta.WebRootPath));
        }
        public IActionResult ReporteDistribucion(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteDistribucion(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReporteDistribucion(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            return Json(await DAO.GenerarExcelReporteDistribucionAsync(fechainicio, fechafin, ruta.WebRootPath));
        }
        public IActionResult ReporteDistribucionDetallado(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            var data = DAO.ReporteDistribucionDetallado(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReporteDistribucionDetallado(string fecha) {
            string fechainicio, fechafin;
            if (fecha != null) {
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }
            else {
                fechainicio = null;
                fechafin = null;
            }
            return Json(await DAO.GenerarExcelReporteDistribucionDetalladoAsync(fechainicio, fechafin, ruta.WebRootPath));
        }
    }
}
