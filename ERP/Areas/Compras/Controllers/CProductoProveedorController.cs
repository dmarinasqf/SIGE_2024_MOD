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
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ERP.Models.Ayudas;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CProductoProveedorController : _baseController
    {
        private readonly Modelo db;
        private readonly IProductoProveedorEF EF;
        private readonly ProductoDAO productoDAO;

        public CProductoProveedorController(IProductoProveedorEF _EF,Modelo context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = _EF;
            LeerJson settings = new LeerJson();
            productoDAO = new ProductoDAO(settings.GetConnectionString());
        }
      
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PRODUCTOPROVEEDOR"))]
        public async Task<IActionResult> Index(int idproveedor)
        {
            datosinicio();
            var data = await productoDAO.getproductosproveedorAsync(idproveedor.ToString(),"",1000,"");
            ProveedorProductoModel vista = new ProveedorProductoModel();         
            vista.proveedor = await db.CPROVEEDOR.FindAsync(idproveedor);
            //UnidadMedidaDAO dao = new UnidadMedidaDAO(db);
            //ViewBag.unidadmedidas = dao.getUnidadesMedida();
            return View(vista);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PRODUCTOPROVEEDOR"))]
        public async Task<IActionResult> RegistrarEditar(CProductoProveedor obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PRODUCTOPROVEEDOR"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PRODUCTOPROVEEDOR"))]
        public async Task<IActionResult> Buscar(int? id)
        {
            return Json(await EF.BuscarAsync(id));
        }
        public async Task<IActionResult> ListarProductosProveedor(string idproveedor,string tipo,int top, string producto)
        {
            var data = await productoDAO.getproductosproveedorAsync(idproveedor, producto,top,tipo);           
            return Json(JsonConvert.SerializeObject( data));
        }
     
        //public async Task<IActionResult> getProductosParaAmarreConProveedor(string categoria)
        //{            

        //    var tarea = await Task.Run(() =>
        //    {
        //        return Json(productoDAO.getProductosParaAmarreConProveedor(categoria));
        //    });
        //    return tarea;

        //}

    }
}