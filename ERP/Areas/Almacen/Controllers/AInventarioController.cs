using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Almacen;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AInventarioController : _baseController
    {
        private readonly InventarioDAO DAO;
        private readonly IInventarioEF EF;
        private readonly IUser user;
        private readonly Modelo db;
        public AInventarioController(IInventarioEF context, IUser _user, Modelo _db, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new InventarioDAO(settings.GetConnectionString());
            user = _user;
            db = _db;
        }

        [Authorize(Roles = ("ADMINISTRADOR,INVENTARIO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            //var data = await EF.ListarAsync();
            return View();
        }

        [Authorize(Roles = ("ADMINISTRADOR,INVENTARIO"))]
        public IActionResult Registrar()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR,INVENTARIO"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarInicioInventario(AInventario oInventario)
        {
            return Json(await EF.RegistrarInicioInventarioAsync(oInventario));
        }
        public async Task<IActionResult> RegistrarDetalleInventario(AInventarioDetalle oInventarioDetalle)
        {
            return Json(await EF.RegistrarDetalleInventarioAsync(oInventarioDetalle));
        }
        public async Task<IActionResult> RegistrarFinalizacionInventario(AInventario oInventario)
        {
            return Json(await EF.RegistrarFinalizacionInventarioAsync(oInventario));
        }
        public async Task<IActionResult> BuscarLotePorLaboratorioSucursal(string idlaboratorio, int idalmacensucursal)
        {
            return Json(await DAO.getLotePorLaboratorioSucursal(idlaboratorio, idalmacensucursal));
        }
        public async Task<IActionResult> ValidarExistenciaInventario(string idalmacensucursal, string idlaboratorio)
        {
            return Json(await DAO.getValidarExistenciaInventario(idalmacensucursal, idlaboratorio));
        }
        public async Task<IActionResult> RegistrarLote(AStockLoteProducto oStockLoteProducto)
        {
            return Json(await EF.RegistrarLoteAsync(oStockLoteProducto));
        }
    }
}
