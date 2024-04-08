using ENTIDADES.compras;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CRequerimientoController : _baseController
    {
        private readonly Modelo db;
        private RequerimientoDAO dao;
        private readonly IRequerimientoEF EF;
        public CRequerimientoController(IRequerimientoEF _EF, Modelo db_, ICryptografhy crytografy, SignInManager<AppUser> signInManager) : base(crytografy, signInManager)
        {
            db = db_;
            EF = _EF;
            LeerJson settings = new LeerJson();
            dao = new RequerimientoDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult RegistrarEditar(int? id)
        {
            datosinicio();
            if (id is null)
                return View(new CRequerimiento());
            var requerimiento = db.CREQUERIMIENTO.Find(id);
            if (requerimiento is null)
                return NotFound();

            return View(requerimiento);
        }
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(CRequerimiento oRequerimiento)
        {
            try
            {
                return Json(await EF.RegistrarEditarAsync(oRequerimiento));
            }
            catch (Exception vEx)
            {
                return null;
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> EditarIdOrdenEnRequerimiento(int idrequerimiento, int idordencompra)
        {
            try
            {
                return Json(await EF.EditarIdOrdenEnRequerimiento(idrequerimiento, idordencompra));
            }
            catch (Exception vEx)
            {
                return null;
            }
        }
        public IActionResult ListarRequerimientos(int top, int suc_codigo, int idgrupo, string estado, string tipoConsulta)
        {
            int idsucursal = 0;
            if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                idsucursal = 0;
            else
                idsucursal = getIdSucursal();

            var data = dao.ListarRequerimientos(top, idsucursal, idgrupo, estado, tipoConsulta);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult BuscarRequerimientoCompleto(int idrequerimiento)
        {
            var data = dao.BuscarRequerimientoCompleto(idrequerimiento);
            return Json(JsonConvert.SerializeObject(data));
        }
    }
}
