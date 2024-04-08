using ERP.Controllers;
using ERP.Models.Ayudas;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Erp.Persistencia.Servicios.Users;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using INFRAESTRUCTURA.Areas.Comercial.DAO;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IUser user;
        private readonly IWebHostEnvironment ruta;
        private readonly LeerJson settings;
         private readonly ReporteDAO DAO;
        public ReporteController(IWebHostEnvironment _ruta,IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
          
            LeerJson settings = new LeerJson();
            DAO = new ReporteDAO(settings.GetConnectionString());
            ruta = _ruta;
            user = _user;
            DAO = new ReporteDAO(settings.GetConnectionString());
            settings = new LeerJson();
        }
        public IActionResult VentasvsCompra() {
            datosinicio();
            return View();
        }
        public IActionResult VentasRango() {
            datosinicio();
            return View();
        }
        public IActionResult ComprasRango() {
            datosinicio();
            return View();
        }
        public IActionResult ReporteVentasvsCompra(string fecha) {
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
            var data = DAO.ReportVentasvsCompras(fechainicio,fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelVentasvsCompras(string fecha) {
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
            return Json(await DAO.GenerarExcelVentasvsComprasAsync(fechainicio,fechafin, ruta.WebRootPath));
        }
        public IActionResult ReporteVentas(string fecha) {
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
            var data = DAO.ReporteVentas(fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        //GenerarExcelVentasAsync
        public async Task<IActionResult> GenerarExcelVentas(string fecha) {
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
            return Json(await DAO.GenerarExcelVentasAsync(fechainicio, fechafin, ruta.WebRootPath));
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
       
    }
}
