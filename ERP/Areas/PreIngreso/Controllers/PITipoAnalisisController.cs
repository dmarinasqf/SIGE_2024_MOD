using ENTIDADES.preingreso;
using ERP.Controllers;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.EF;
using Erp.Persistencia.Modelos;

namespace ERP.Areas.PreIngreso.Controllers
{
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PITipoAnalisisController : _baseController   
    {
        private readonly ITipoAnalisisEF EF;
        private readonly Modelo db;
        public PITipoAnalisisController(Modelo _db,ITipoAnalisisEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db=_db;
            EF = _EF;
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_TIPOANALISIS"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data =await EF.ListarAsync();
            return View(data);         
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_TIPOANALISIS"))]
        public async Task<IActionResult> RegistrarEditar(PITipoAnalisis obj)
        {
            var data= await EF.RegistrarEditarAsync(obj);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_TIPOANALISIS"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            var data = await EF.EliminarAsync(id);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_TIPOANALISIS"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            var data = await EF.HabilitarAsync(id);
            return Json(data);
        }
       
        public async Task<IActionResult> ListarTiposAnalisis()
        {
            var data = await EF.ListarTipoAnalisisAsync();
            return Json(data);
        }
        public async Task<IActionResult> ListarTiposAnalisisHabilitado()
        {
            var data = await EF.ListarTiposAnalisisHabilitadoAsync();
            return Json(data);
        }
        public async Task<IActionResult> BuscarTipoAnalisis(int id)
        {
            var data = await EF.BuscarTipoAnalisisAsync(id);
            return Json(data);
        }
    }
}
