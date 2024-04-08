using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using INFRAESTRUCTURA.Areas.Maestros;
using Erp.Persistencia.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class DepartamentoProvinciaDistritoController : Controller
    {
        private readonly Modelo db;
        private readonly DepartamentoProvinciaDistritoEF EF;
        public DepartamentoProvinciaDistritoController(Modelo context)
        {
            db = context;
            EF = new DepartamentoProvinciaDistritoEF(db);

        }
        public async Task<IActionResult> ListarDepartamentos()
        {
            return Json(await EF.ListarDepartamentoAsync());
        }
        public async Task<IActionResult> ListarProvincias(int departamento)
        {
            return Json(await EF.ListarProvinciasAsync(departamento));
        }
        public async Task<IActionResult> ListarDistritos(int provincia)
        {
            return Json(await EF.ListarDistritosAsync(provincia));
        }
    }
}
