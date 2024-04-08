using ClosedXML.Excel;
using ENTIDADES.Identity;
using Erp.Entidades.Contabilidad;
using Erp.Infraestructura.Areas.Contabilidad.DAO;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Contabilidad.Controllers
{
    [Area("Contabilidad")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteCajaChicaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly ReporteCajaChicaDAO DAO;

        public ReporteCajaChicaController(IWebHostEnvironment ruta_, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new ReporteCajaChicaDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, VER REPORTE GENERAL CAJA CHICA")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

      

        //acciones para consultar y rendir gastos dependiendo del rol
        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult ConsultarFicha(string id)
        {
            datosinicio();
            ViewBag.idSucursalResp = id;
            //var rendicion = DAO.RendicionCajaChicaBuscar(id);
            //ViewBag.Rendicion = rendicion;
            return PartialView();
        }

     

    


     


        [Authorize(Roles = "ADMINISTRADOR, VER REPORTE GENERAL CAJA CHICA")]
        [HttpPost]
        public IActionResult cajaRendicionListarUser( string fechaInicial, string fechaFinal,string origen)
        {
            var datos = DAO.cajaRendicionListarUser( fechaInicial, fechaFinal, origen);
            return Json(JsonConvert.SerializeObject(datos));
        }

     


    }
}
