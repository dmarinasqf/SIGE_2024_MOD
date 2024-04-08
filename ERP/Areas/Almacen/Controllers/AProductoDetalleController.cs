using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.EF;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;
using ENTIDADES.comercial;
using System.Collections.Generic;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]

    public class AProductoDetalleController : _baseController
    {

        private readonly IProductoEF productoEF;
        private readonly IDetalleProductoGenericoEF EF;
        private readonly ProductoDAO DAO;
        public AProductoDetalleController(IProductoEF context, IDetalleProductoGenericoEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            productoEF = context;
            LeerJson settings = new LeerJson();
            DAO = new ProductoDAO(settings.GetConnectionString());
            EF = _EF;
        }
        public async Task<IActionResult> GetDetalleProducto(int id)
        {

            var principioactivo = await productoEF.getDetallePrincipioActivoxProducto(id);
            var accionfarma = await productoEF.getDetalleAccionFarmaxProducto(id);
            return Json(new { principioactivo = principioactivo , accionfarma =accionfarma});
        }

        
        //DETALLE DE PRODUCTOS Y SUS GENERICOS  

        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public IActionResult DetalleProductoGenerico(int? id)
        {
            datosinicio();
            ViewBag.producto = productoEF.buscarProducto(id);
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> RegistrarDetalleGenerico(ADetalleProductoGenerico obj)
        {    
                return Json(await EF.RegistrarDetalleGenericoAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> EditarDetalleGenerico(ADetalleProductoGenerico obj)
        {    
                return Json(await EF.EditarDetalleGenericoAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> EliminarDetalleGenerico(int? id)
        {
            return Json(await EF.EliminarDetalleGenericoAsync(id));

        }
        [HttpPost]
        public IActionResult BuscarDetalleGenerico(int? id)
        {
            return Json(JsonConvert.SerializeObject( DAO.getGenericoxProducto(id)));
        }
        public IActionResult BuscarGenericos(string filtro,int top)
        {
            return Json(JsonConvert.SerializeObject( DAO. BuscarGenericos( filtro,  top)));
        }
        
  
        //DETALLE DE PRODUCTOS Y SUS ACCIONES FARMACOLOGICAS  
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> RegistrarDetalleAccionFarmacologico(ADetalleAccionFarmacologica obj)
        {
            return Json(await EF.RegistrarDetalleAccionFarmacologicoAsync(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> EliminarDetalleAccionFarmacologico(int? id)
        {
            return Json(await EF.EliminarDetalleAccionFarmacologicoAsync(id));

        }
        [HttpPost]
        public async Task<IActionResult> BuscarDetalleAccionFarma(int? id)
        {
            return Json(await productoEF.getDetalleAccionFarmaxProducto(id));

        }

        //PRINCIPIOS ACTIVOS
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> RegistrarEditarPrincipioActivo(ADetallePrincipioActivo obj)
        {
            return Json(await EF.RegistrarEditarPrincipiosActivos(obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> EliminarPrincipioActivo(int? id)
        {
            return Json(await EF.EliminarPrincipioActivo(id));

        }
        [HttpPost]
        public async Task<IActionResult> BuscarDetallePrincipiosActivos(int? id)
        {
            return Json(await productoEF.getDetallePrincipioActivoxProducto(id));
        }
        //LISTA DE PRECIOS
        public IActionResult BuscarListaPrecioConProducto(int idproducto,string tipo)
        {
            var data = DAO.BuscarListaPrecioConProducto(idproducto,tipo);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult AgregarEliminarProductoLista(List<PreciosProducto> precios)
        {
            return Json(EF.AgregarEliminarProductoLista(precios));
        }

    }
}
