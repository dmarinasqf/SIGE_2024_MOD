using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Almacen;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Crypto.Prng.Drbg;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]

    public class ASalidaController : _baseController
    {
        private readonly IIngresoManualEF EF;
        private readonly IngresoManualDAO DAO;
        public ASalidaController(IIngresoManualEF EF_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = EF_;
            LeerJson settings = new LeerJson();
            DAO = new IngresoManualDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();

            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, SALIDA STOCK")]
        public IActionResult Registrar()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, SALIDA STOCK")]
        [HttpPost]
        public async Task<IActionResult> Registrar(ASalidaManual salida)
        {
            salida.idempresa = getEmpresa();
            salida.idsucursal = getIdSucursal();
            
            return Json(await EF.RegistrarSalidaAsync(salida));

        }
        public IActionResult getHistorialSalidas(string sucursal, string fechainicio, string fechafin, int top)
        {
            if (sucursal is null || sucursal is "")
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();
            var data = DAO.getHistorialSalidas(sucursal, fechainicio, fechafin, top);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult Imprimir_Guia(int idsalida) {
            var data = DAO.getTablaSalidaManual(idsalida);
            return View(data);
        }
    }
}
