using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using Newtonsoft.Json;
using ENTIDADES.Almacen;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Microsoft.AspNetCore.Hosting;
using Erp.Infraestructura.Areas.Almacen.producto.query;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AProductoController : _baseController
    {
        private readonly IProductoEF EF;
        private readonly ProductoDAO DAO;
        private readonly Modelo db;
        private readonly IWebHostEnvironment ruta;
        //editado por mi
        public AProductoController(IWebHostEnvironment _ruta, Modelo _db, IProductoEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new ProductoDAO(settings.GetConnectionString());
            db = _db;
            ruta = _ruta;
        }


        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            ViewBag.tipoproducto = await EF.ListarTipoProductoAsync();
            return View();
        }

        public IActionResult AnalisisProducto(int? idproducto, string idproveedor)
        {
            datosinicio();
            ViewBag.idproducto = idproducto ?? 0;
            ViewBag.idproveedor = idproveedor ?? "";
            return View();
        }


        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> RegistrarEditar(int? id)
        {
            datosinicio();
            await datosregistroAsync();
            if (id is null || id is 0)
                return View(new AProducto());
            var producto = db.APRODUCTO.Find(id);
            if (producto is null)
                return NotFound();
            else
                return View(producto);
            //DAO
        }
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_PRODUCTO"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AProducto objproducto)
        {
            return Json(await EF.RegistrarEditarAsync(objproducto));//EARTCOD1016
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> ActivarProducto(int? id)
        {
            return Json(await EF.ActivarProductoAsync(id));
        }

        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_PRODUCTO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }

        public async Task<IActionResult> getProductosconStockxAlmacen(string idalmacen,
            string tipoproducto, string producto, int top)
        {
            var data = await DAO.getProductosconstockxAlmacen(idalmacen, tipoproducto, producto, top);
            return Json(data);
        }

        public IActionResult buscarProductoRegSanFecVenLote(int id)
        {
            var data = DAO.buscarProductoRegSanFecVenLote(id);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult buscarProducto(int? id)
        {
            var data = Json(EF.buscarProducto(id));
            return Json(EF.buscarProducto(id));
        }

        [HttpPost]
        public async Task<IActionResult> listarproveedores()
        {
            return Json(await EF.listarproveedoresAsync());
        }

        [HttpPost]
        public IActionResult BuscarProductos(string codigoproducto, string nombreproducto, string tipoproducto, string estado, string laboratorio, int top)
        {
            var data = DAO.BuscarProductos(codigoproducto, nombreproducto, tipoproducto, estado, laboratorio, top);
            return Json(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public IActionResult ObtenerProductos(string filtro, string estado, int top)
        {
            var data = DAO.ObtenerProductosxFiltro(filtro, estado, top);
            return Json(JsonConvert.SerializeObject(data));
        }

        public async Task<IActionResult> listarProductosporcategoria(string categoria)
        {
            return Json(await EF.listarProductosporcategoriaAsync(categoria));

        }
        //public async Task<IActionResult> getProductosxLaboratorio(int laboratorio)
        //{
        //    var tarea = await Task.Run(() =>
        //    {
        //        return Json(DAO.getProductosxLaboratorio(laboratorio));
        //    });
        //    return tarea;
        //}       
        public async Task<IActionResult> ListarTipoProducto()
        {
            return Json(await EF.ListarTipoProductoAsync());
        }
        public async Task<IActionResult> ListarProductoxAlmacenSucusal(string tipoproducto, string codigo,
            string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {
            var valorSeparado = idsucursalalmacen.Split('_');
            var data = new object[valorSeparado.Length];
            for (int i = 0; i < valorSeparado.Length; i++)
            {
                data.SetValue(await DAO.getProductosxAlmacenstock(tipoproducto, codigo,
                nombreproducto, laboratorio, clase, subclase, estado,
                valorSeparado[i], top), i);
            }
            return Json(data);
        }
        public async Task<IActionResult> ListarProductoxAlmacenSucusal_V2(string tipoproducto, string codigo,
            string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {
            var valorSeparado = idsucursalalmacen.Split('_');
            var data = new object[valorSeparado.Length];
            for (int i = 0; i < valorSeparado.Length; i++)
            {
                data.SetValue(await DAO.getProductosxAlmacenstock_V2(tipoproducto, codigo,
                nombreproducto, laboratorio, clase, subclase, estado,
                valorSeparado[i], top), i);
            }
            return Json(data);
        }
        public async Task<IActionResult> ListarProductosNuevosDistribucion(string idsucursalalmacen)
        {
            var valorSeparado = idsucursalalmacen.Split('_');
            var data = new object[valorSeparado.Length];
            for (int i = 0; i < valorSeparado.Length; i++)
            {
                data.SetValue(await DAO.getListarProductosNuevosDistribucion(idsucursalalmacen), i);
            }
            
            return Json(data);
        }
        public async Task<IActionResult> ListarProductoDistribucionxLote(string idproducto, string lote, string sucursal, string almacen)
        {
            var data = await DAO.getProductoDistribucionxlote(idproducto, lote, sucursal, almacen);
            return Json(data);
        }
        public IActionResult ListarProductoxLaboratorio(int idlaboratorio)
        {
            return Json(EF.ListarProductosxLaboratorio(idlaboratorio));
        }
        public async Task<IActionResult> DescargarExcelProductos(string nombreproducto, string tipoproducto, string estado, string laboratorio)
        {
            var data = await DAO.GenerarExcelProductosAsync(nombreproducto, tipoproducto, estado, laboratorio, ruta.WebRootPath);
            return Json(data);
        }
        public async Task<IActionResult> GetProductosxLaboratorio(GetProductosxLaboratorio.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        //solo nombre y codigo
        public async Task<IActionResult> BuscarProductos1(BuscarProductos1.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public IActionResult BuscarProductosRequerimiento(int idproducto)
        {
            var data = DAO.BuscarProductosRequerimiento(idproducto);
            return Json(JsonConvert.SerializeObject(data));
        }

        private async Task datosregistroAsync()
        {
            var modelo = await EF.ListarModelAsync();
            ViewBag.productopresentacion = modelo.productopresentaciones; ;
            ViewBag.clase = modelo.clases;
            ViewBag.um = modelo.unidadmedidas;
            ViewBag.laboratorio = modelo.laboratorio;
            ViewBag.tipoproducto = modelo.tipoproductos;
            ViewBag.proveedor = modelo.proveedor;
            ViewBag.temperatura = modelo.temperatura;
            ViewBag.tipotributo = modelo.tipotributos;
            ViewBag.formafarmaceutica = modelo.formafarmaceutica;
        }



        //codigo de barra yex
        public async Task<IActionResult> SP_ListarDatos(string idcodigobarra)
        {
            bool existe = await DAO.SP_ExisteCodigoBarra(idcodigobarra);
            return Json(new { existe = existe });
        }

    }
}