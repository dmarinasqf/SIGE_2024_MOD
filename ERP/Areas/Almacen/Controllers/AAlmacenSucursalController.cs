using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ENTIDADES.Almacen;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AAlmacenSucursalController :_baseController
    {
        private readonly IAlmacenSucursalEF EF;        
        private readonly AlmacenSucursalDAO DAO;        
        
        public AAlmacenSucursalController(IAlmacenSucursalEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new AlmacenSucursalDAO(settings.GetConnectionString());
        }
      
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ALMACENSUCURSAL"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var modelo = await EF.ListarModelAsync();
            ViewBag.almacen = modelo.almacenes;
            ViewBag.areaalmacen = modelo.areaalmacenes;
            ViewBag.sucursales = modelo.sucursales;
            return View();
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ALMACENSUCURSAL"))]
        public async Task<IActionResult> RegistrarEditar(AAlmacenSucursal obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }       
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ALMACENSUCURSAL"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ALMACENSUCURSAL"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_ALMACENSUCURSAL"))]
        public IActionResult buscarAlmacenxSucursal(string idsucursal)
        {         
            var data = DAO.BuscarAlmacenxSucursal(idsucursal);
            return Json(data);
        }

        public IActionResult BuscarAlmacenxSucursal2(int idsucursal)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            var data = EF.BuscarAlmacenxSucursal2(idsucursal);
            return Json(data);
        }

        // CREACION DEL LISTADO DE ALAMCEN FILTRADO POR EMPLEADO Y SUCURSAL
        public IActionResult BuscarAlmacenxSucursalempleado(int idsucursal, int idempleado)
        {
     
            if (idsucursal is 0)
                idsucursal = getIdSucursal();

            if (idempleado is 0)
                idempleado = getIdEmpleado();
            var data = DAO.BuscarAlmacenxSucursalempleado(idsucursal, idempleado);
            return Json(JsonConvert.SerializeObject(data));
        }
    }

}