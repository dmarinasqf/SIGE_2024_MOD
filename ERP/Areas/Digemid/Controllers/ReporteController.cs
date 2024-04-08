using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Digemid.dao;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Digemid.Controllers
{
    [Area("Digemid")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly ReporteDigemidDAO DAO;
        
        public ReporteController( IWebHostEnvironment _webHostEnvironment,  ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {           
            ruta = _webHostEnvironment;           
            LeerJson settings = new LeerJson();
            DAO = new ReporteDigemidDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, MODULO DE DIGEMID")]
        public IActionResult MaestroMensual()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, MODULO DE DIGEMID")]
        public IActionResult PreciosMensual()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, MODULO DE DIGEMID")]
        public IActionResult PreciosCovid()
        {
            datosinicio();
            return View();
        }
        [HttpPost]
        public IActionResult GetMaestroMensual(string fechainicio, string fechafin, string sucursal, string empresa, bool iscovid, int top, int lista)
        {
            var data = DAO.GetMaestroMensual(fechainicio,fechafin,sucursal,empresa,iscovid,top,lista);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> ExcelMaestroMensual(string fechainicio, string fechafin, string sucursal, string empresa, bool iscovid, int top, int lista)
        {
            var data =await DAO.ExcelMaestroMensual(fechainicio,fechafin,sucursal,empresa,iscovid,top, lista, ruta.WebRootPath);
            return Json((data));
        }
        [HttpPost]
        public IActionResult GetPreciosMensual(int sucursal, int lista, string tipo)
        {
            var data = DAO.GetPreciosMensual(sucursal,lista,tipo);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> ExcelPreciosMensual(int sucursal, int lista, string tipo)
        {
            var data =await DAO.ExcelPreciosMensual(sucursal,lista,tipo, ruta.WebRootPath);
            return Json((data));
        }
        [HttpPost]
        public IActionResult GetPreciosCovid(int sucursal, int lista, string tipo, string fechainicio, string fechafin)
        {
            var data = DAO.GetPreciosCovid(sucursal, lista, tipo,fechainicio,fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> ExcelPreciosCovid(int sucursal, int lista, string tipo, string fechainicio, string fechafin)
        {
            var data = await DAO.ExcelPreciosCovid(sucursal, lista, tipo, fechainicio, fechafin, ruta.WebRootPath);
            return Json((data));
        }

    }
}
