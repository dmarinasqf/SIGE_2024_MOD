using Aspose.Html;
using Aspose.Html.Saving;
using DinkToPdf.Contracts;
using DocumentFormat.OpenXml.Drawing.Charts;
using ENTIDADES.Almacen;
using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Almacen.stock.commad;
using Erp.Infraestructura.Areas.Almacen.stock.query;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AStockController : _baseController
    {
        private readonly StockDAO DAO;
        private readonly IStockEF EF;
        private readonly ReporteAlmacenDAO reporteAlmacenDAO;
        private readonly IWebHostEnvironment ruta;
        private readonly Modelo db;
        private readonly IConverter pdf;
        public AStockController(Modelo db_, IWebHostEnvironment ruta_, IStockEF _EF, IConverter _pdf, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new LeerJson();
            DAO = new StockDAO(settings.GetConnectionString());
            reporteAlmacenDAO = new ReporteAlmacenDAO(settings.GetConnectionString());
            pdf = _pdf;
            EF = _EF;
            ruta = ruta_;
            db = db_;
        }
        [Authorize(Roles = ("ADMINISTRADOR, AJUSTAR STOCK"))]
        public IActionResult AjustarStock()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, CERAR STOCK"))]
        public IActionResult CerarStock()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, REPORTE STOCK"))]
        public IActionResult ReporteStock()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, CARGAR STOCK FM"))]
        public IActionResult CargarStock()
        {
            datosinicio();
            return View();
        }
        public IActionResult ListarProductosConStockDistint(string producto, int sucursal, string idalmacensucursal, int top, int idlista)
        {
            if (sucursal is 0)
                sucursal = getIdSucursal();
            return Json(JsonConvert.SerializeObject(DAO.BuscarProductos(producto, sucursal, idalmacensucursal, idlista, top)));
        }
        public IActionResult GetStockProductosxLote(int idproducto, int sucursal, string idalmacensucursal)
        {
            if (sucursal is 0)
                sucursal = getIdSucursal();
            //MPTEMPORAL
            //var datos =Json(JsonConvert.SerializeObject(DAO.GetStockProductosxLote(idproducto, sucursal,idalmacensucursal)));
            return Json(JsonConvert.SerializeObject(DAO.GetStockProductosxLote(idproducto, sucursal, idalmacensucursal)));
        }

        public IActionResult GetStockProductosParaVenta(long idstock, int idlista, string canalventa, string sucursal_reg)
        {
            return Json(JsonConvert.SerializeObject(DAO.GetStockProductosParaVenta(idstock, idlista, canalventa, sucursal_reg)));
        }

        //EARTCOD1008
        //public IActionResult GetStockProductosParaVenta(long idstock, int idlista, string canalventa, string sucursal_reg, int idcliente)
        //{
        //    return Json(JsonConvert.SerializeObject(DAO.GetStockProductosParaVenta(idstock, idlista, canalventa, sucursal_reg, idcliente)));
        //}
        public IActionResult GetStockProductoxDescuento(long idproducto, int idlista, int iddescuento, int idsucursal, string tipo)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            return Json(JsonConvert.SerializeObject(DAO.GetStockProductoxDescuento(idproducto, idlista, iddescuento, idsucursal, tipo)));
        }
        public IActionResult GetProductosConStock(string producto, string sucursal, string tipoproducto, int top)
        {
            if (sucursal is null || sucursal is "")
                sucursal = getIdSucursal().ToString();
            return Json(JsonConvert.SerializeObject(DAO.GetProductosConStock(producto, sucursal, tipoproducto, top, "")));
        }
        public IActionResult BuscarStock(long idstock)
        {
            return Json(EF.BuscarStock_Producto(idstock));
        }
        public IActionResult BuscarStockXLaboratorio(int idlaboratorio, int idsucursal)
        {
            return Json(EF.BuscarStock_ProductoxLaboratorio(idlaboratorio, idsucursal));
        }
        public IActionResult ActualizarStock(AStockLoteProducto stock)
        {
            string iduser = getIdEmpleado().ToString();
            return Json(EF.ActualizarStock(stock, iduser));
        }
        public IActionResult BuscarStockPorProductoLista(int idproducto, int idsucursal, int idlista)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            var almacen = (from x in db.AALMACENSUCURSAL
                           join y in db.AAREAALMACEN on x.idareaalmacen equals y.idareaalmacen
                           //where x.suc_codigo==idsucursal && y.descripcion=="MOSTRADOR" && x.estado=="HABILITADO"
                           where x.suc_codigo == idsucursal && x.estado == "HABILITADO"
                           select new AAlmacenSucursal
                           {
                               idalmacensucursal = x.idalmacensucursal
                           }
                           ).FirstOrDefault();

            if (almacen is null)
                return Json(JsonConvert.SerializeObject(new DataTable()));
            var data = db.ASTOCKPRODUCTOLOTE.Where(x => x.idproducto == idproducto && x.idalmacensucursal == almacen.idalmacensucursal && x.estado == "HABILITADO"
            //&& x.candisponible>0
            ).FirstOrDefault();
            if (data is null)
                return Json(JsonConvert.SerializeObject(new DataTable()));

            //return Json(JsonConvert.SerializeObject(DAO.GetStockProductosParaVenta(data.idstock, idlista, "", "".ToString(),0)));//CANALVENTA //EARTCOD1008
            return Json(JsonConvert.SerializeObject(DAO.GetStockProductosParaVenta(data.idstock, idlista, "", "")));//CANALVENTA
        }
        public IActionResult GetGenericosXProductosConStock(int idproducto, int idlista, string sucursal)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();
            var data = DAO.GetGenericosXProductosConStock(idproducto, sucursal, idlista);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult GetStockEnSucursalxProducto(int idproducto)
        {
            var data = DAO.GetStockEnSucursalxProducto(idproducto);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public IActionResult ReporteStock(string sucursal, int top, string producto, string laboratorio, string almacen)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();
            var data = reporteAlmacenDAO.ReporteStock(producto, sucursal, top, laboratorio, almacen);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> GenerarExcelStock(string sucursal, int top, string producto, string laboratorio, string almacen)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") || !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();
            var data = await reporteAlmacenDAO.GenerarExcelStockAsync(producto, sucursal, top, laboratorio, almacen, ruta.WebRootPath);
            return Json(data);
        }

        [HttpPost]
        public IActionResult GenerarPdfStock(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                //url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "ReporteStock", "vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public IActionResult GenerarPdfStock(string producto, int top, string sucursal, string laboratorio, string almacen)
        {
            if (sucursal is null)
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString();
            var data = reporteAlmacenDAO.ReporteStock(producto, sucursal, top, laboratorio, almacen);
            mensajeJson oMensaje = new mensajeJson();
            oMensaje.objeto = JsonConvert.SerializeObject(data);
            oMensaje.mensaje = "ok";
            return View(oMensaje);
        }

        [HttpPost]
        [Authorize(Roles = ("ADMINISTRADOR, CERAR STOCK"))]
        public async Task<IActionResult> CerarStock(CerarStock.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        [HttpPost]
        [Authorize(Roles = ("ADMINISTRADOR, CARGAR STOCK FM"))]
        public async Task<IActionResult> CargarStock(CargarStock.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetStockProducto(GetStockProducto.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        public IActionResult RegistrarProductosSinStock(int idproducto, int sucursal, string idalmacensucursal)
        {
            if (sucursal is 0)
                sucursal = getIdSucursal();

            return Json(JsonConvert.SerializeObject(DAO.RegistrarProductosSinStock(idproducto, sucursal, idalmacensucursal)));
        }
    }
}
