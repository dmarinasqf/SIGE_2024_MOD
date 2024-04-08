using ENTIDADES.comercial;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Comercial.DAO;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
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

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class IncentivoController : _baseController
    {

        private readonly Modelo db;
        private readonly IncentivoDAO dao;
        private readonly IWebHostEnvironment ruta;
        public IncentivoController(IWebHostEnvironment ruta_,Modelo db_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = db_;
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            dao = new IncentivoDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR INCENTIVOS")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR INCENTIVOS")]
        public IActionResult RegistrarIncentivos()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR INCENTIVOS")]
        public IActionResult RegistrarIncentivosJson(string data)
        {
            var datos = JsonConvert.DeserializeObject<List<Incentivo>>(data);
            var res= dao.RegistrarIncentivos(datos,getIdEmpleado().ToString());
            return Json(res);
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR INCENTIVOS")]
        public IActionResult RegistrarIncentivosBloque(string data,string   sucursales)
        {
          
            var res= dao.RegistrarIncentivosBloque(data, sucursales, getIdEmpleado().ToString());
            return Json(res);
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR INCENTIVOS")]
        public IActionResult SubirIncentivos()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> DescargarExcelIncentivos(int idsucursal)
        {
            return Json(await dao.GenerarExcelIncentivos(idsucursal, ruta.WebRootPath));
        }

    }
}
