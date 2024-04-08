using ENTIDADES.preingreso;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Drawing.Charts;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;

namespace ERP.Areas.PreIngreso.Controllers
{
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PIRangoMuestraAOController : _baseController   
    {
        private readonly Modelo db;        
        private readonly IRangoMuestraAOEF EF;        
        public PIRangoMuestraAOController(Modelo context,IRangoMuestraAOEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = _EF;
            db = context;
        }
        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO RANGOMUESTRAAO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data = await EF.ListarAsync();
            return View(data);
        }

        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO RANGOMUESTRAAO"))]
        public async Task<IActionResult> RegistrarEditar(PIRangoMuestraAO obj)
        {
            var data = await EF.RegistrarEditarAsync(obj);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO RANGOMUESTRAAO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            var data = await EF.EliminarAsync(id);
            return Json(data);
        }

        public async Task<IActionResult> Listar()
        {
            return Json(await EF.ListarAsync());
        }
        public async Task<IActionResult> ListarHabilitados()
        {
            var data = await EF.ListarHabilitadoAsync();
            return Json(data);
        }
        public async Task<IActionResult> Buscar(int id)
        {
            var data = await EF.BuscarAsync(id);
            return Json(data);
        }
    }
}
