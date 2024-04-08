using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.comercial;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Comercial.DAO;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using INFRAESTRUCTURA.Areas.Comercial.listaprecios;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;

using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Erp.Infraestructura.Areas.Comercial.listaprecios.busqueda;
using Erp.Infraestructura.Areas.Ventas.DAO;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ListaPreciosController : _baseController
    {
        private readonly IListaPreciosEF EF;
        private readonly Modelo db;
        private readonly ListaPreciosDAO DAO; 
        private readonly IWebHostEnvironment ruta;
        private readonly CanalVentaDAO dao_cv;

        public ListaPreciosController(IWebHostEnvironment _ruta,Modelo db_,IListaPreciosEF _EF, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = _EF;
            db = db_;
            ruta = _ruta;
            LeerJson settings = new LeerJson();
            DAO = new ListaPreciosDAO(settings.GetConnectionString());
            dao_cv = new CanalVentaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR, VER LISTA DE PRECIOS"))]
        public IActionResult Index()
        {
         
            datosinicio();
            return View(EF.ListarListas());
        }
        [Authorize(Roles = ("ADMINISTRADOR, VER LISTA DE PRECIOS"))]
        public IActionResult EditarPrecios(int idlista)
        {
            datosinicio();
            var aux = db.LISTAPRECIOS.Find(idlista);
            if (aux is null)
                return NotFound();
            return View(aux);
        }
        [Authorize(Roles = ("ADMINISTRADOR, EDITAR LISTA DE PRECIOS"))]
        public IActionResult SubirLista()
        {
            datosinicio();
            return View(EF.ListarListas());
        }
        [Authorize(Roles = ("ADMINISTRADOR, EDITAR LISTA DE PRECIOS"))]
        [HttpPost]
        public IActionResult SubirLista(string lista, bool codadesy)
        {
            var data = JsonConvert.DeserializeObject<List<PreciosProducto>>(lista);
            var res = DAO.RegistrarPrecio(data, getIdEmpleado().ToString(), codadesy);
            return Json(res);
        }
        [Authorize(Roles = ("ADMINISTRADOR, CREAR LISTA DE PRECIOS"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(ListaPrecios obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        } 
        public IActionResult ListarListas( )
        {
            return Json(EF.ListarListas());
        }
        public IActionResult ListarCanalesPrecios()
        {
            return Json(dao_cv.ListarCanalesPrecios());
        }
        public  IActionResult ListarListasHabilitadas( )
        {
            return Json( EF.ListarListasHabilitadas());
        }
        public async Task<IActionResult> BuscarProductosListaPrecios(BuscarProductosLista.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        //
        public async Task<IActionResult> BuscarProductosListaConIncentivo(BuscarProductosListaConIncentivo.Ejecutar obj)
        {
            //EARTCOD1009 <--
            if (obj.sucursal is 0)
                obj.sucursal = getIdSucursal();
            //TEMPORAL
            var mediador = _mediator.Send(obj);
            var json_ = Json(await mediador);
            return Json(await mediador);
        }

        public async Task<IActionResult> DescargarLista(int top, int lista, string producto, string laboratorio,string tipo)
        {
            return Json(await DAO.GenerarExcelListaAsync(top,lista,producto,laboratorio,tipo, ruta.WebRootPath));
        }
        [Authorize(Roles = ("ADMINISTRADOR, EDITAR LISTA DE PRECIOS"))]
        [HttpPost]
            

        public async Task<IActionResult> EditarPreciosProducto(List<PreciosProducto> lista)
        {       
            return Json(await EF.EditarPreciosProducto(lista));
        }
        public IActionResult ListarPreciosSucursal(int? idsucursal)
        {
            if (idsucursal is null)
                idsucursal = getIdSucursal();
            return Json( EF.ListarPreciosSucursal(idsucursal.Value));
        }
        public IActionResult DuplicarPreciosLista(int lista1, int lista2)
        {

            return Json(DAO.DuplicarPreciosLista(lista1, lista2,getIdEmpleado().ToString()));
        }
        public IActionResult ListarListaXProducto(int idproducto)
        {

            return Json(EF.ListarListaXProducto(idproducto));
        }
        public IActionResult ListarPreciosxListasyProducto(string listas, int idproducto)
        {
            return Json(EF.ListarPreciosxListasyProducto(listas,idproducto));
        }
        public async Task<IActionResult> BuscarProductoByItemLista(BuscarProductoByItemLista.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ActualizarPrecios(List<string []> arreglo) {

            return Json(DAO.ActualizarPrecios(arreglo));
          
        }
    }
}
