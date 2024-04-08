using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.ventas;
using ERP.Controllers;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Areas.Ventas.Controllers 
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class IngresoEgresosController : _baseController 
    {

        private readonly IIngresoEgresoEF EF;
        private readonly ICajaVentaEF cajaEF;
        public IngresoEgresosController(ICajaVentaEF _cajaEF,IIngresoEgresoEF _EF,ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            EF = _EF;
            cajaEF = _cajaEF;
        }
        [Authorize(Roles = "ADMINISTRADOR, EGRESO DE CAJA")]

        public IActionResult Egreso()
        {
            datosinicio();
            ViewBag.verificarcaja = cajaEF.VerificarAperturaCaja(getIdEmpleado().ToString());
            return View();
        }
        public async Task<IActionResult> RegistrarEgreso(EgresoCaja egreso)
        {
            egreso.emp_codigo = getIdEmpleado();
            egreso.suc_codigo = getIdSucursal();
            return Json(await EF.RegistrarEgresoAsync(egreso));
        }
        public  IActionResult ListarTipoEgresos()
        {
            return Json( EF.ListarTipoEgresos());
        }
    }
}
