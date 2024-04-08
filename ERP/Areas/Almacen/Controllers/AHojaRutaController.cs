using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Linq;
using Erp.Persistencia.Servicios.Users;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.SeedWork;
using System.Globalization;
using ENTIDADES.Almacen;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AHojaRutaController : _baseController
    {
        private readonly IGuiaSalidaEF EF;
        private readonly ReporteAlmacenDAO DAO;
        private readonly IWebHostEnvironment ruta;
        private readonly IUser user;
        public AHojaRutaController(IGuiaSalidaEF context,IWebHostEnvironment _ruta,IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new ReporteAlmacenDAO(settings.GetConnectionString());
            ruta = _ruta;
            user = _user;
        }
       
        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.sucursales = modelo.sucursal;
        }

        public IActionResult Index() {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> RegistrarEditar(int? id) {
            datosinicio();
            await datosinicioAsync();
            var data = await EF.BuscarAsync(id);
            ViewBag.mensajebusqueda = data.mensaje;
            if (data.mensaje == "nuevo")
                return View();
            else if (data.mensaje == "notfound")
                return NotFound();
            else if (data.mensaje == "ok")
                return View();
            else
                return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AHojaRuta obj) {
            var data = ""; //await EF.RegistrarAsync(obj);
            return Json(data);
        }

    }
}
