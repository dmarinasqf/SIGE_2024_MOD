using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf.Contracts;
using ENTIDADES.comercial;
using ENTIDADES.compras;
using ENTIDADES.preingreso;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Erp.Persistencia.Repositorios.SeedWork;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    //APROBAR FACTURA DE PREINGRESO
    //VER FACTURA DE PREINGRESO
    public class CAprobarFacturaController : _baseController
    {
        private readonly Modelo db;
        private AprobarFacturaDAO dao;
        private PreingresoDAO preingresoDAO;
        private AlmacenSucursalDAO DAOAlmSuc;
        private readonly IAprobarFacturaEF EF;
        private readonly IConverter pdf;
        private readonly IPreingresoEF preingresoEF;
        public CAprobarFacturaController(IPreingresoEF _preingresoEF, IConverter pdf_,IAprobarFacturaEF _EF, Modelo db_,ICryptografhy crytografy, SignInManager<AppUser> signInManager) :base(crytografy, signInManager)
        {
            db = db_;
            EF = _EF;
            pdf = pdf_;
            preingresoEF = _preingresoEF;
            LeerJson settings = new LeerJson();
            dao = new AprobarFacturaDAO(settings.GetConnectionString());
            preingresoDAO = new PreingresoDAO(settings.GetConnectionString());
            DAOAlmSuc = new AlmacenSucursalDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult ListarFacturas(int top, string numfactura, string numpreingreso, string numordencompra, string estado)
        {
            int idsucursal = 0;
            if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                idsucursal = 0;
            else
                idsucursal = getIdSucursal();

            var data = dao.ListarFacturas(top ,numfactura, numpreingreso, numordencompra, idsucursal, estado);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult ListarFacturasParaNotaCredito(int top, string numfactura, string estadoNC)
        {
            int idsucursal = 0;
            if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                idsucursal = 0;
            else
                idsucursal = getIdSucursal();

            var data = dao.ListarFacturasParaNotaCredito(top, numfactura, idsucursal, estadoNC);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult NCDevolucionDiferencia()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> Imprimir(int id)
        {
            try
            {
                var obj = await db.PIFACTURASPREINGRESO.FindAsync(id);
                var pre = await db.PIPREINGRESO.FindAsync(obj.idpreingreso);
                if (obj is null)
                    return NotFound();
                if (pre.idempresa == getEmpresa() && pre.idsucursal == getIdSucursal())
                {
                    var data = preingresoDAO.getPreingresoCompletoPorFactura(id);
                    ViewBag.empresa= ((db.EMPRESA.Find(pre.idempresa)));
                    return View(data);
                }
                else
                    return NotFound("El registro pertenece a otra empresa y sucursal ");
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        public async Task<IActionResult> ImprimirDevolucionDiferencia(int id)
        {
            try
            {
                var obj = await db.PIFACTURASPREINGRESO.FindAsync(id);
                var pre = await db.PIPREINGRESO.FindAsync(obj.idpreingreso);
                if (obj is null)
                    return NotFound();
                if (pre.idempresa == getEmpresa() && pre.idsucursal == getIdSucursal())
                {
                    var data = preingresoDAO.getPreingresoCompletoPorFactura(id);
                    ViewBag.empresa = ((db.EMPRESA.Find(pre.idempresa)));
                    return View(data);
                }
                else
                    return NotFound("El registro pertenece a otra empresa y sucursal ");
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [Authorize(Roles = "APROBAR FACTURA DE PREINGRESO, ADMINISTRADOR, VER FACTURA DE PREINGRESO")]

        public IActionResult AprobarFactura(int? id)
        {
            datosinicio();
            datosiniciocotizacionAsync();
            if (id is null)
                return View(new PIFacturaPreingreso ());
            PIFacturaPreingreso factura = new();
            //var factura = db.PIFACTURASPREINGRESO.Find(id);
            factura.idfactura = (int)id;
            if (factura is null)
                return NotFound();
           
            return View(factura);
        }
        [Authorize(Roles = "ADMINISTRADOR, APROBAR FACTURA DE PREINGRESO")]
        [HttpPost]
        public async Task<IActionResult> AprobarFactura(string factura,PIPreingreso preingreso,string detalle,string cotizaciondetalle,string preciosproducto,string historial)
        {
            try {
                PIFacturaPreingreso facturaP = new PIFacturaPreingreso();
                facturaP = JsonConvert.DeserializeObject<PIFacturaPreingreso>(factura);

                List<PIPreingresoDetalle> detallePreIngreso = new List<PIPreingresoDetalle>();
                detallePreIngreso = JsonConvert.DeserializeObject<List<PIPreingresoDetalle>>(detalle);

                List<CCotizacionDetalle> detallecotizacion1 = new List<CCotizacionDetalle>();
                detallecotizacion1 = JsonConvert.DeserializeObject<List<CCotizacionDetalle>>(cotizaciondetalle);

                List<PreciosProducto> preciosproducto1 = new List<PreciosProducto>();
                if (preciosproducto.Length > 0)
                    preciosproducto1 = JsonConvert.DeserializeObject<List<PreciosProducto>>(preciosproducto);

                List<CHistorialPrecios> historial1 = new List<CHistorialPrecios>();
                if (historial.Length > 0)
                    historial1 = JsonConvert.DeserializeObject<List<CHistorialPrecios>>(historial);

                List<AAlmacenSucursal> lAlmacenSucursal = new List<AAlmacenSucursal>();
                lAlmacenSucursal = DAOAlmSuc.BuscarAlmacenxSucursal(getIdSucursal().ToString());

                var stockpreingreso = preingresoDAO.getstockpreingreso(facturaP.idfactura, "factura");
                string jsonstock = "";
                if (stockpreingreso.Rows.Count > 0)
                {
                    jsonstock = JsonConvert.SerializeObject(stockpreingreso);
                }
                return Json(await EF.AprobarFacturaAsync(facturaP, preingreso, detallePreIngreso, detallecotizacion1, preciosproducto1, jsonstock,historial1, lAlmacenSucursal));
            } catch (Exception vEx) 
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<IActionResult> AnularFactura(int idpreingreso, int idfactura)
        {
            try
            {
                string jsoncuarentena = "";
                string jsonaprobado = "";
                var result = new mensajeJson("Error al anular la factura.", null);
                if (idfactura > 0)
                {
                    var objfactura = await db.PIFACTURASPREINGRESO.FindAsync(idfactura);
                    if (objfactura.iddocumento == 1000)
                    {
                        if (objfactura != null || objfactura is not null)
                        {
                            if (objfactura.estado == "HABILITADO")
                            {
                                var jsoncuarentenapreingreso = "";
                                var stockcuarentenapreingreso = preingresoDAO.getstockpreingreso(idfactura, "factura");//Anular cuarentena.
                                if (stockcuarentenapreingreso.Rows.Count > 0)
                                    jsoncuarentenapreingreso = JsonConvert.SerializeObject(stockcuarentenapreingreso);
                                result = await preingresoEF.AnularPreingresoAsync(idpreingreso, idfactura, jsoncuarentenapreingreso);
                            }
                            if (objfactura.estado == "APROBADO")
                            {
                                var stockaprobado = preingresoDAO.getstockpreingreso(idfactura, "factura aprobada");//Aprobado
                                if (stockaprobado.Rows.Count > 0)
                                    jsonaprobado = JsonConvert.SerializeObject(stockaprobado);

                                var stockcuarentena = preingresoDAO.getstockpreingreso(idfactura, "factura");//Cuarentena
                                if (stockcuarentena.Rows.Count > 0)
                                    jsoncuarentena = JsonConvert.SerializeObject(stockcuarentena);

                                result = await EF.AnularFacturaAsync(idpreingreso, idfactura, jsoncuarentena, jsonaprobado);
                            }
                            else if (objfactura.estado == "ANULADO")
                            {
                                result = new mensajeJson("La factura ya fue anulada.", null);
                            }
                        }
                    }
                    else if(objfactura.iddocumento == 1004)
                    {
                        if (objfactura.estado == "APROBADO")
                        {
                            var stockaprobado = preingresoDAO.getstockpreingreso(idfactura, "factura aprobada");//Aprobado
                            if (stockaprobado.Rows.Count > 0)
                                jsonaprobado = JsonConvert.SerializeObject(stockaprobado);
                            result = await EF.AnularGuiaAsync(idpreingreso, idfactura, jsonaprobado);
                        }
                        else if (objfactura.estado == "ANULADO")
                        {
                            result = new mensajeJson("La factura ya fue anulada.", null);
                        }
                    }
                    else
                    {
                        new mensajeJson("No se puede anular el documento.", null);
                    }
                }
                return Json(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        public IActionResult GenerarPDF(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "Factura", "vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        public IActionResult BuscarFactura(int idfactura)
        {
            var data = dao.getFacturaPreingresoParaValidacion(idfactura);
            return Json(JsonConvert.SerializeObject(data));
        }
        private void datosiniciocotizacionAsync()
        {
           
            ViewBag.condicionpago =db.CCONDICIONPAGO.Where(x=>x.estado=="HABILITADO").ToList().OrderBy(x=>x.descripcion);
            ViewBag.tipopago = db.FTIPOPAGO.Where(x => x.estado == "HABILITADO").ToList().OrderBy(x => x.descripcion);
            ViewBag.IGV = db.CCONSTANTE.Find("IGV").valor;

        }
        public IActionResult VerificarCredenciales_AprobarFactura(string usuario, string clave)
        {
            return Json(EF.VerificarCredenciales_AprobarFactura(usuario, clave));
        }
        [HttpPost]
        public async Task<IActionResult> ValidarAnalisisOrganoleptico(int idfactura)
        {
            try
            {
                return Json(await EF.ValidarAnalisisOrganolepticoAsync(idfactura));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        public IActionResult BuscarDetallePorFacturaParaNotaCredito(int idfactura)
        {
            var data = dao.BuscarDetallePorFacturaParaNotaCredito(idfactura);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> ValidarNotaDeCredito(int idfactura, string estadoNC)
        {
            try
            {
                return Json(await EF.ValidarNotaDeCreditoAsync(idfactura, estadoNC));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
