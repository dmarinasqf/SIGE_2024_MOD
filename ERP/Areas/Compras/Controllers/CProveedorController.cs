using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;

using System.Collections.Generic;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]

    public class CProveedorController : _baseController
    {
        private readonly Modelo db;
        private readonly IProveedorEF EF;
        private readonly ProveedorDAO DAO;
        private readonly IWebHostEnvironment ruta;
        //lromero Nov
        private readonly IProductoEF EFTP;

        public CProveedorController(IWebHostEnvironment ruta_,Modelo context, IProveedorEF _EF, IProductoEF _EFTP, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = _EF;
            //lromero Nov
            EFTP = _EFTP;
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new ProveedorDAO(settings.GetConnectionString());
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();

            var modelo = await EF.ListarModelAsync();

            ViewBag.moneda = modelo.monedas;
            ViewBag.pais = modelo.pais;
            ViewBag.bancos = modelo.bancos;
            ViewBag.condicionpago = modelo.condicionpago;
            //lromero Nov
            ViewBag.tproductos = await EFTP.ListarTipoProductoAsync();


            return View(DAO.getProveedores("",""));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> RegistrarEditar(CProveedor obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
     
        public async Task<IActionResult> Buscar(int? id)
        {
            return Json(await EF.BuscarAsync(id));
        }       

        [HttpPost]
        public async Task<IActionResult> listarproveedores()
        {
            return Json(await EF.listarproveedoresHabilitadosAsync());
        }
        public IActionResult ListarProveedor()
        {
            return Json(EF.ListarProveedor());
        }
        public IActionResult RegistrarCuenta(CuentaProveedor cuenta)
        {
            return Json(EF.RegistrarCuenta(cuenta));
        }
        public IActionResult EliminarCuenta(int id)
        {
            return Json(EF.EliminarCuenta(id));
        }
        public IActionResult ListarCuentas(int idproveedor)
        {
            return Json(EF.ListarCuentas(idproveedor));
        }
        public IActionResult BuscarCuenta(int id)
        {
            return Json(EF.BuscarCuenta(id));
        }
        public IActionResult BuscarProveedores(string filtro)
        {
            return Json(EF.BuscarProveedores(filtro));
        }

        //CONTACTO DE PROVEEDOR   
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> IndexContactos(int id)
        {
            datosinicio();
            var data = db.CPROVEEDOR.Find(id);
            if (data is null)
                return NotFound();
            ViewBag.proveedor = data.razonsocial;
            ViewBag.idproveedor = data.idproveedor;
            return View(await EF.listarContactosProveedorAsync(id));
          
        }


        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> RegistrarEditarContacto(CContactosProveedor obj)
        {
            return Json(await EF.RegistrarEditarContactoAsync(obj));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> BuscarContacto(int? id)
        {
            return Json(await EF.BuscarContactoAsync(id));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDOR"))]
        public async Task<IActionResult> EliminarContacto(int? id)
        {
            return Json(await EF.EliminarContactoAsync(id));
        }
        public async Task<IActionResult> listarLaboratorioProveedor(string proveedor,string laboratorio)
        {
            return Json(await EF.listarLaboratorioProveedorAsync(proveedor, laboratorio));
        }
        
        public async Task<IActionResult> listarContactosProveedor(int proveedor)
        {
            return Json(await EF.listarContactosProveedorAsync(proveedor));

        }
        //LISTAR PROVEEDORES POR PRODUCTO
        /***************************************************************************************/

        public async Task<IActionResult> getProveedoresxProducto(string idproducto)
        {            
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return Json(new mensajeJson("ok", DAO.ListarProveedoresxProducto(idproducto)));
                });
                return tarea;
            }
            catch (Exception )
            {
                return Json(new mensajeJson("Error en el servidor", null));
            }


        }

        //ARCHIVO
        public IActionResult RegistrarDatosArchivo(ArchivoProveedor obj, IFormFile file)
        {
            return Json(EF.RegistrarDatosArchivo(obj, file, ruta.WebRootPath));
        }
        public IActionResult EliminarArchivo(int id)
        {
            return Json(EF.EliminarArchivo(id));
        }
        public IActionResult ListarArchivos(int idproveedor)
        {
            return Json(EF.ListarArchivos(idproveedor));
        }
    }
}