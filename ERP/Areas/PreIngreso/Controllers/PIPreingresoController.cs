using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using ENTIDADES.preingreso;
using System.Collections.Generic;
using System.Data;
using Newtonsoft.Json;
using Rotativa.AspNetCore;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using DinkToPdf.Contracts;
using DinkToPdf;
using Microsoft.AspNetCore.Http;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ENTIDADES.Almacen;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ERP.Areas.PreIngreso.Controllers
{
    //PERFILES
    /*
     M_PREINGRESO_PREINGRESO_LISTAR
     M_PREINGRESO_PREINGRESO_REGISTRAR
     M_PREINGRESO_PREINGRESO_EDITAR
     M_PREINGRESO_PREINGRESO_ANULAR
    */
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PIPreingresoController : _baseController
    {
        private readonly Modelo db;
        private readonly IPreingresoEF EF;
        private readonly ICondicionEmbalajeEF embalajeEF;
        private readonly IBonificacionFueraDocumentoEF bonidocEF;
        private readonly PreingresoDAO DAO;
        private AlmacenSucursalDAO DAOAlmSuc;
        private readonly IConverter pdf;
        private readonly OrdenCompraDAO ordenCompraDAO;
        private readonly IWebHostEnvironment ruta;
        public PIPreingresoController(ICondicionEmbalajeEF _embalajeEF, IWebHostEnvironment _webHostEnvironment, IBonificacionFueraDocumentoEF _bonidocEF, IPreingresoEF _EF, Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, IConverter _pdf) : base(cryptografhy, signInManager)
        {
            ruta = _webHostEnvironment;
            db = context;
            embalajeEF = _embalajeEF;
            EF = _EF;
            pdf = _pdf;
            bonidocEF = _bonidocEF;
            LeerJson settings = new LeerJson();
            DAO = new PreingresoDAO(settings.GetConnectionString());
            ordenCompraDAO = new OrdenCompraDAO(settings.GetConnectionString());
            DAOAlmSuc = new AlmacenSucursalDAO(settings.GetConnectionString());
        }


        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_LISTAR"))]
        public IActionResult Index()
        {
            var sucursal = db.SUCURSAL.Find(getIdSucursal());
            //if (!sucursal.isprimario.HasValue || !sucursal.isprimario.Value)
            //    return BadRequest();
            var verificar = EF.sucursaldeloginesdelaempresa();
            ViewBag.verificar = verificar;
            datosinicio();
            return View();
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_LISTAR"))]
        public IActionResult IndexLisEditDoc()
        {
            var sucursal = db.SUCURSAL.Find(getIdSucursal());
            //if (!sucursal.isprimario.HasValue || !sucursal.isprimario.Value)
            //    return BadRequest();
            var verificar = EF.sucursaldeloginesdelaempresa();
            ViewBag.verificar = verificar;
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_REGISTRAR"))]
        public async Task<IActionResult> Registrar(int? id, int idfactura = 0)
        {
            var sucursal = db.SUCURSAL.Find(getIdSucursal());
            //if (!sucursal.isprimario.HasValue || !sucursal.isprimario.Value)
            //    return BadRequest();
            var verificar = EF.sucursaldeloginesdelaempresa();
            ViewBag.verificar = verificar;
            await datosinicioAsync();
            datosinicio();
            if (id is null || id is 0)
                return View(new PIPreingreso { fecha = DateTime.Now, estado = "PENDIENTE", quimico = ViewBag.quimicolocal });
            else
            {
                var obj = db.PIPREINGRESO.Find(id.Value);
                obj.idfactura = idfactura;
                if (obj.idempresa == getEmpresa() && obj.idsucursal == getIdSucursal())
                {
                    return View(obj);
                }
                else
                    return NotFound("El registro pertenece a otra empresa y sucursal ");
            }

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_REGISTRAR"))]
        public IActionResult BonificacionFueraDocumento()
        {
            datosinicio();
            return View();

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_LISTAR"))]

        public IActionResult GenerarPDF(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "Preingreso","vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        [HttpPost]
        public IActionResult GenerarPDFActaRecepcion(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "Acta de recepción", "horizontal");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_LISTAR"))]
        public async Task<IActionResult> Imprimir(int id)
        {
            try
            {
                var obj = await db.PIPREINGRESO.FindAsync(id);
                if (obj is null)
                    return NotFound();
                if (obj.idempresa == getEmpresa() && obj.idsucursal == getIdSucursal())
                {
                    var data = DAO.getPreingresoCompletoImprimir(id);
                    data.Add(JsonConvert.SerializeObject(db.EMPRESA.Find(obj.idempresa)));
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
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_LISTAR"))]
        public async Task<IActionResult> ImprimirPorFactura(int id)
        {
            try
            {
                var factura = await db.PIFACTURASPREINGRESO.FindAsync(id);
                if (factura is null)
                    return NotFound();
                var obj = db.PIPREINGRESO.Find(factura.idpreingreso);
                if (obj is null)
                    return NotFound();
                if (obj.idempresa == getEmpresa() && obj.idsucursal == getIdSucursal())
                {
                    var data = DAO.getPreingresoCompletoPorFacturaImprimir(id);
                    data.Add(JsonConvert.SerializeObject(db.EMPRESA.Find(obj.idempresa)));
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
        public async Task<IActionResult> ImprimirActaRecepcion(int id)
        {
            try
            {
                var factura = await db.PIFACTURASPREINGRESO.FindAsync(id);
                if (factura is null)
                    return NotFound();
                var obj = db.PIPREINGRESO.Find(factura.idpreingreso);
                if (obj is null)
                    return NotFound();

                var data = DAO.getactaderecepcion(id);             
                return View(data);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        //ImprimirActaRecepcion_V1
        public IActionResult ImprimirActaRecepcion_V1(int id) {
            //EART 
            try {
                var data = DAO.getActaRecepcionImprimir(id);
                return View(data);
            }
            catch (Exception e) {
                return BadRequest(e);
            }
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_REGISTRAR"))]
        public async Task<IActionResult> RegistrarEditar(PIPreingreso preingreso)
        {
            var idempleado = 0;
            var rutadoc = ruta.WebRootPath;
            if (idempleado is 0)
                idempleado = getIdEmpleado();
            List<AAlmacenSucursal> lAlmacenSucursal = new List<AAlmacenSucursal>();
            lAlmacenSucursal = DAOAlmSuc.BuscarAlmacenxSucursal(getIdSucursal().ToString());
            return Json(await EF.RegistrarEditarAsync(preingreso, lAlmacenSucursal, idempleado,rutadoc));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_PREINGRESO_PREINGRESO_ANULAR"))]
        public async Task<IActionResult> AnularPreingreso(int id, int idfactura)
        {
            var stockpreingreso = DAO.getstockpreingreso(idfactura, "factura");
            string json = "";
            if (stockpreingreso.Rows.Count > 0)
            {
                json = JsonConvert.SerializeObject(stockpreingreso);
            }
            return Json(await EF.AnularPreingresoAsync(id, idfactura, json));
        }
        public async Task<IActionResult> ActualizarOrdenCompraAplicada(int[] ordenes)
        {
            return Json(await EF.ActualizarOrdenCompraAplicadaAsync(ordenes));

        }
        public async Task<IActionResult> BuscarLotesItemDetallePreingreso(int id)
        {
            return Json(await EF.BuscarLotesItemDetallePreingresoAsync(id));

        }
        public IActionResult VerificarSiOrdenTienePreingreso(int idorden)
        {
            return Json(EF.VerificarSiOrdenTienePreingreso(idorden));

        }
        public IActionResult BuscarPreingresoCompleto(int id)
        {
            var data = DAO.getPreingresoCompleto(id);
            return Json(JsonConvert.SerializeObject(data));

        }
        //BY GUSTAVO, CARGAR DATA PARA AO
        //EARTCOD1016
        public IActionResult BuscarPreingresoCompleto_StockxFactura(int id)
        {
            var data = DAO.getPreingresoCompleto_StockxFactura(id);
            //var datos = JsonConvert.SerializeObject(data);
            return Json(JsonConvert.SerializeObject(data));

        }
        public IActionResult ListarFacturas(int id)
        {
            return Json(EF.ListarFacturas(id));
        }
        [HttpPost]
        public async Task<IActionResult> BuscarPreingresos(string preingreso, string estado, string sucursal, string orden, string factura, int top)
        {
            if (sucursal is null || sucursal is "")
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = "";
                else
                    sucursal = getIdSucursal().ToString();

            var tarea = await Task.Run(() =>
            {
                return (DAO.getPreingresos(preingreso, getEmpresa().ToString(), estado, sucursal, orden, factura, top));
            });
            return Json(JsonConvert.SerializeObject(tarea));
        }
        [HttpPost]
        public async Task<IActionResult> BuscarPreingresosAprobarFactura(string preingreso, string estado, string sucursal, string orden, string factura, string proveedor, int top)
        {
            if (sucursal is null || sucursal is "")
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = "";
                else
                    sucursal = getIdSucursal().ToString();

            var tarea = await Task.Run(() =>
            {
                return (DAO.getPreingresosAprobarFactura(preingreso, getEmpresa().ToString(), estado, sucursal, orden, factura, proveedor, top));
            });
            return Json(JsonConvert.SerializeObject(tarea));
        }
        [HttpPost]
        public async Task<IActionResult> BuscarPreingresosParaAnalisisOrganoleptico(string preingreso, string estado, string sucursal, string orden, string factura, int top)
        {
            if (sucursal is null || sucursal is "")
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = "";
                else
                    sucursal = getIdSucursal().ToString();

            var tarea = await Task.Run(() =>
            {
                return (DAO.getPreingresosparaAnalisisOrg(preingreso, getEmpresa().ToString(), estado, sucursal, orden, factura, top));
            });
            return Json(JsonConvert.SerializeObject(tarea));


        }
        public IActionResult VerificarIngresoOrdenAlmacenes(int orden, int? sucursal)
        {
            if (sucursal is null)
                sucursal = getIdSucursal();
            return Json(EF.VerificarIngresoOrdenAlmacenes(orden, sucursal.Value));

        }
        public IActionResult GetBonificacionxFactura(int idfactura)
        {
            var data = DAO.getbonificacionxfactura(idfactura, "INAFECTO");
            return Json(JsonConvert.SerializeObject(data));

        }
        public IActionResult RegistrarEditarBonificacionFueraDoc(List<PIDetalleBonificacionFueraDocumento> bonificaciones)
        {

            return Json(bonidocEF.RegistrarEditar(bonificaciones, ""));
        }

        public IActionResult ListarItemsCondicionEmbalaje()
        {
            return Json(embalajeEF.ListarItemsEmbalaje());
        }
        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.documentos = modelo.documentos;

            ViewBag.almacenes = modelo.almacenes;
            ViewBag.quimicolocal = modelo.quimicolocal;
        }
        ////by GUSTAVO
        //public IActionResult BuscarPreingresoCompletoxId(int id)
        //{
        //    var data = DAO.getPreingresoCompletoxid(id);
        //    return Json(JsonConvert.SerializeObject(data));
        //}
        //[HttpPost]
        //public async Task<ActionResult> GetPreingresoCompleto(int id)
        //{
        //    try
        //    {
        //        var pre = await db.PIPREINGRESO.FindAsync(id);
        //        if (pre is null)
        //            return null;
        //        var idorden = pre.idordencompra;
        //        var tarea = await Task.Run(() =>
        //        {

        //            pre.idordencompra = idorden;
        //            pre.empresa = db.EMPRESA.Find(pre.idempresa);
        //            var detalle = DAO.getDetalle(id);
        //            pre.detalle = detalle;
        //            return pre;
        //        });
        //        return Json(tarea);

        //    }
        //    catch (Exception)
        //    {
        //        return Json("error");
        //    }
        //}

        // subida archivo
        public string guardarpdfpreingreso1(string nombreArchivo, IFormFile file)
        {

            return "";
        }

        [HttpPost]
        public async Task<ActionResult> guardarpdfpreingreso(string nombreArchivo, string codigocarperta, string codigolote, string codigoProducto, IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                try
                {
                    string rutaBasica = AppDomain.CurrentDomain.BaseDirectory;              
                    string rutaHastaERP = Path.GetFullPath(Path.Combine(rutaBasica, "..\\..\\..\\"));    


                    var fileName = codigocarperta +"-"+ codigoProducto+"-"+ codigolote;
                 
                    string filePath = Path.GetFullPath(Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\preingreso\\"+ fileName + "\\" + nombreArchivo));             
                    if (!Directory.Exists(Path.GetDirectoryName(filePath)))
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                    }
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    var respuesta = new
                    {
                        mensaje = "Archivo guardado con éxito",
                        fileName = fileName,
                        nombreArchivo = nombreArchivo,
                    };
                    // Puedes devolver alguna respuesta al cliente
                    return Json(respuesta);
                }
                catch (Exception ex)
                {
                    return Json("Error al guardar el archivo: " + ex.Message);
                }
            }
            else
            {
                return Json("No se seleccionó ningún archivo");
            }
        }

        // Codigo editar documentos
        [HttpPost]
        public async Task<ActionResult> editarpdfpreingreso(string nombreArchivo, string valorCodigocarpeta, string valorCodigodocumento, IFormFile file, int txtiddocumentoDrive,string drdecredentials)
        { 
            if (file != null && file.Length > 0)
            {
                try
                {
                    string rutaBasica = AppDomain.CurrentDomain.BaseDirectory;
                    string rutaHastaERP = Path.GetFullPath(Path.Combine(rutaBasica, "..\\..\\..\\"));
                    string filePath = Path.GetFullPath(Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\preingreso\\" + valorCodigocarpeta + "\\" + nombreArchivo));
                    if (!Directory.Exists(Path.GetDirectoryName(filePath)))
                    {
                        Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                    }
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    var respuesta = new
                    {
                        mensaje = "Archivo guardado con éxito",
                        fileName = valorCodigocarpeta,
                        nombreArchivo = nombreArchivo,
                    };
                    // Puedes devolver alguna respuesta al cliente
                    //return Json(respuesta);
                    var resultadoEliminar = Json(EF.eliminarchivodriveapi(valorCodigocarpeta, valorCodigodocumento));


                    // Acceder al mensaje desde la propiedad Value
                    string mensajeEliminar = (string)resultadoEliminar.Value.GetType().GetProperty("mensaje").GetValue(resultadoEliminar.Value);
                    var rutadoc = ruta.WebRootPath;
                    // Verificar si el mensaje en resultadoEliminar no es "ok"
                    var mensaje = "";
                    if (mensajeEliminar == "OK")
                    {
                        var edit = Json(EF.editararchivoapi(valorCodigocarpeta, nombreArchivo, rutadoc));
                        var mensajeedit = (string)edit.Value.GetType().GetProperty("mensaje").GetValue(edit.Value);
                        var mensajeobjeto = edit.Value.GetType().GetProperty("objeto").GetValue(edit.Value);
   
                        var nomcoddocumento = (string)mensajeobjeto.GetType().GetProperty("nomcoddocumento")?.GetValue(mensajeobjeto);
                        var previewLink = (string)mensajeobjeto.GetType().GetProperty("previewLink")?.GetValue(mensajeobjeto);
                        var codigoDrive = (string)mensajeobjeto.GetType().GetProperty("codigoDrive")?.GetValue(mensajeobjeto);

                        if (mensajeedit == "OK")
                        {
                            var idempleado = 0;                     
                            if (idempleado is 0)
                                idempleado = getIdEmpleado();
                            var data = DAO.editarDocumentosLote(txtiddocumentoDrive, idempleado, nomcoddocumento, codigoDrive, previewLink);
                            return Json(JsonConvert.SerializeObject(data));
                            mensaje = "OK";
                        }
                        else
                        {
                            mensaje = mensajeEliminar;
                            throw new Exception("Lanzar al catch");
                        }
                    }else
                    {
                        mensaje = "ERROR";
                        throw new Exception("Lanzar al catch");
                    }
                 
                    

                    return Json(mensaje);
                }
                catch (Exception ex)
                {
                    return Json("Error al guardar el archivo: " + ex.Message);
                }
            }
            else
            {
                return Json("No se seleccionó ningún archivo");
            }
        }










        // CODIGO PARA EL LISTADO DE DOCUMENTOS 
        public IActionResult BuscarDocuLote(string txtcodpreingreso, string txtcodigororden, string txtidlote, string txtestadolote)
        {
            var data = DAO.getBuscarDocuLote( txtcodpreingreso,  txtcodigororden,  txtidlote,  txtestadolote);
            return Json(JsonConvert.SerializeObject(data));

        }

        public IActionResult listaDatoDocumentosLote(int idloteeditar)
        {
            var data = DAO.getlistaDatoDocumentosLote(idloteeditar);
            return Json(JsonConvert.SerializeObject(data));

        }
        
        public IActionResult validardocuemntoloteexistente(string codigolote, string iddetallepreingreso, int idproducto)
        {
            var data = DAO.validardocuemntoloteexistente( codigolote, iddetallepreingreso,  idproducto);
            return Json(JsonConvert.SerializeObject(data));

        }



    }
}
