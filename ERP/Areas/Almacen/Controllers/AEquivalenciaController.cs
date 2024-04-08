using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using ENTIDADES.Almacen;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ERP.Models.Ayudas;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AEquivalenciaController : _baseController
    {
        private readonly IEquivalenciaEF EF;
        private readonly EquivalenciaDAO DAO;
        public AEquivalenciaController(IEquivalenciaEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new EquivalenciaDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_EQUIVALENCIA"))]
        public async Task<IActionResult> Index()
        {
            var modelo = await EF.ListarModelAsync();
            ViewBag.unidadmedida = modelo.unidadmedidas;
            return View();
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_EQUIVALENCIA"))]
        public async Task<IActionResult> RegistrarEditar(AEquivalencia obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_EQUIVALENCIA"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));

        }
        // getEquivalencias
        public IActionResult getEquivalencias(string uma, string umc)
        {          
            var data = DAO.getEquivalencias(uma,umc);
            return Json(data);
        }

    }
}