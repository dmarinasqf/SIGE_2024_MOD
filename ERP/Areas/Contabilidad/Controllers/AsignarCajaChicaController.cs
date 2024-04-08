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
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Contabilidad.Controllers
{
    [Area("Contabilidad")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AsignarCajaChicaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly AsignarCajaChicaDAO DAO;
        private readonly AsignacionCajaHistoricoDAO historicoDAO;

        public AsignarCajaChicaController(IWebHostEnvironment ruta_, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new AsignarCajaChicaDAO(settings.GetConnectionString());
            historicoDAO = new AsignacionCajaHistoricoDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        public IActionResult Index()
        {
            ViewBag.empresas = DAO.empresasListar();
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        [HttpPost]
        public IActionResult CajaAsignacionListar(string fechaInicial, string fechaFinal)
        {
            var datos = DAO.cajaAsignacionListar(fechaInicial, fechaFinal);
            return Json(JsonConvert.SerializeObject(datos));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        public IActionResult CajaAsignacionBuscar(string id)
        {
            var datos = DAO.cajaAsignacionBuscar(id);
            return Json(JsonConvert.SerializeObject(datos));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        [HttpPost]
        public IActionResult CajaAsignacionAgregar(ResponsableSede responsableSede)
        {
            var respuesta=DAO.CajaAsignacionAgregar(responsableSede);
            return Json(JsonConvert.SerializeObject(respuesta));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        [HttpPost]
        public IActionResult CajaAsignacionReponer(ResponsableSede responsableSede, IFormFile imgFile)
        {
            if (imgFile != null)
            {
                if (imgFile.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        imgFile.CopyTo(ms);
                        var imgBytes = ms.ToArray();
                        responsableSede.recursoImg = imgBytes;
                    }
                }
            }

            var respuesta = DAO.CajaAsignacionReponer(responsableSede);
            return Json(JsonConvert.SerializeObject(respuesta));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        [HttpPost]
        public IActionResult CajaAsignacionReasignarResp(ResponsableSede responsableSede)
        {
            var respuesta = DAO.CajaAsignacionReasignarResp(responsableSede);
            return Json(JsonConvert.SerializeObject(respuesta));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        public IActionResult AsignacionCajaHistoricoListar(string id)
        {
            var datos = historicoDAO.AsignacionCajaHistoricoListar(id);
            return Json(JsonConvert.SerializeObject(datos));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER ASIGNAR CAJA CHICA")]
        [HttpPost]
        public IActionResult AsignacionEmpleadoListar(string nombres)
        {
            var datos = DAO.empleadoListar(nombres);
            
            return Json(JsonConvert.SerializeObject(datos));
        }

        //--EARTCOD1024---FUNCION VALIDAR RENDICION----------------------------------

        [Authorize(Roles = "ADMINISTRADOR, VER VALIDAR RENDICION")]
        public IActionResult ValidarRendicionCajaChica()
        {
            datosinicio();
            return View();
        }

        public IActionResult CajaChicaValidarRendicionListar(string fechaInicial, string fechaFinal, string responsablecaja)
        {
            string _responsablecaja = responsablecaja == null ? "" : responsablecaja;
            var data = DAO.CajaChicaValidarRendicionListar(fechaInicial, fechaFinal, _responsablecaja);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult CajaChicaValidarEstado(int idCajaChicaDet, string estado_op)
        {
            var data = DAO.CajaChicaValidarEstado(idCajaChicaDet, estado_op);
            return Json(JsonConvert.SerializeObject(data));
        }
        
    }
}
