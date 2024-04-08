using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using Erp.Persistencia.Servicios;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using DinkToPdf.Contracts;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CCotizacionController : _baseController
    {
        private readonly ICotizacionEF EF;
        private readonly Modelo db;
        private readonly IWebHostEnvironment ruta;
        private readonly IConverter pdf;
        private readonly CotizacionDAO DAO;

        public CCotizacionController(ICotizacionEF context, IWebHostEnvironment _webHostEnvironment, Modelo _db, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, IConverter _pdf) : base(cryptografhy, signInManager)
        {
            EF = context;
            db = _db;
            ruta = _webHostEnvironment;
            pdf = _pdf;
            LeerJson settings = new LeerJson();
            DAO = new CotizacionDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        public async Task<IActionResult> RegistrarEditar(int? id)
        {

            datosinicio();
            await datosiniciocotizacionAsync();
            if (id is null || id is 0)
                return View(new CCotizacion { idcotizacion = 0, estado = "PENDIENTE", fechasistema = DateTime.Now, idproveedor = 0, idcontacto = 0, idrepresentante = 0 }); ;
            var cotizacion = db.CCOTIZACION.Find(id.Value);
            if (cotizacion is null)
                return NotFound();
            if (cotizacion.codigoempresa == getEmpresa())
            {
                return View(cotizacion);
            }
            else
                return NotFound();

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(CCotizacion cotizacion)
        {
            cotizacion.emp_codigo = getIdEmpleado();
            cotizacion.suc_codigo = getIdSucursal();
            cotizacion.codigoempresa = getEmpresa();
            updatedesc(cotizacion);
            return Json(await EF.RegistrarEditarAsync(cotizacion));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar1(CCotizacion cotizacion)
        {
            if (cotizacion.idcotizacion == 0)
            {
                cotizacion.emp_codigo = getIdEmpleado();
                cotizacion.suc_codigo = getIdSucursal();
                cotizacion.codigoempresa = getEmpresa();
            }

            //updatedesc(cotizacion);
            await EF.RegistrarEditarAsync(cotizacion);
            return Json(null);
        }


        public void updatedesc(CCotizacion cc){
            var detalle = JsonConvert.DeserializeObject<List<CCotizacionDetalle>>(cc.detallejson);
            for (int i = 0; i < detalle.Count; i++)
            {
                DAO.updateDescuentos(detalle[i].idproducto, detalle[i].des2, detalle[i].des3);
            }
        }
        public IActionResult BuscarProformaCompleta(int id)
        {
            return Json(JsonConvert.SerializeObject( DAO.getCotizacionCompleta(id)));

        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        public async Task<IActionResult> Duplicar(int id)
        {
            var aux = await EF.BuscarAsync(id);
            if (aux is null)
                return NotFound();
            if (aux.codigoempresa != getEmpresa())
                return NotFound("El registro no pertenece a la empresa");

            var cotizacion = await EF.DuplicarAsync(id);
            if (cotizacion is null)
                return BadRequest();
            return RedirectToAction("RegistrarEditar", new { id = cotizacion.idcotizacion });                 
        }
        public IActionResult BuscarCotizacion(string estado, string fecha,string id,int top)
        {            
            var data =JsonConvert.SerializeObject( DAO.getCotizacion(estado, id,"",getEmpresa().ToString(),top ));
            return Json(data);
        }
        public IActionResult BuscarCotizacionxProveedor(string proveedor,int top)
        {          
            var data = DAO.getCotizacion("TERMINADO","",proveedor,getEmpresa().ToString(),top);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> AnularCotizacion(int? id)
        {
            return Json(await EF.AnularCotizacionAsync(id));
        }
        public async Task<IActionResult> habilitarCotizacion(int? id)
        {
            return Json(await EF.habilitarCotizacionAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        public async Task<IActionResult> Imprimir(int id)
        {
            try
            {
                var cotizacion = await EF.BuscarAsync(id);

                if (cotizacion is null)
                    return NotFound();
                if (cotizacion.codigoempresa != getEmpresa())
                    return NotFound("El registro no pertenece a la empresa");
                var data=((DAO.getCotizacionCompletaImprimir(id)));
                data.Add(JsonConvert.SerializeObject(db.EMPRESA.Find(cotizacion.codigoempresa)));
                return View(data);

            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        
        public IActionResult GenerarPDF(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies,"Cotizacion","vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception e)
            {
                return Json(e.Message);
            }

        }
        private async Task<EmailHelper> guardarPDFEnviar(int id, string url)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    EmailHelper emailaux = new EmailHelper();
                    var cotizacion = db.CCOTIZACION.Find(id);
                    
                    if (cotizacion is null)
                        return new EmailHelper { respuesta = "No existe proforma" };
              
                    List<string> paths = new List<string>();
                    var fileName = cotizacion.codigocotizacion + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".pdf";
                    string filePath = Path.GetFullPath(Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\proformas\\"));
                    GenerarPDF generarPDF = new GenerarPDF();
                    var document = generarPDF.GuardarPDFVerticalA4(url, Request.Cookies, filePath, fileName);
                    if (document is null)
                        return new EmailHelper { respuesta = "Error al guardar datos de pdf" };

                    pdf.Convert(document);
                    string path = Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\proformas\\", fileName);
                    paths.Add(path);
                    emailaux.rutasarchivosenviar=paths;                                                                               
                    emailaux.respuesta = "ok";
                    emailaux.emailsreceptores = new List<string>();
                    emailaux.user = db.CCONSTANTE.Find("USERCOCO").valor;
                    emailaux.email = db.CCONSTANTE.Find("COCODI").valor;
                    emailaux.pass = db.CCONSTANTE.Find("COCOPASS").valor;
                    emailaux.host = db.CCONSTANTE.Find("HOSTCORREO").valor;
                    emailaux.port = db.CCONSTANTE.Find("PORTCORREO").valor;
                    return emailaux;
                }
                catch (Exception e)
                {
                    return new EmailHelper { respuesta = e.Message };

                }
            });
            return tarea;               
        }
        public async Task<IActionResult> EnviarEmail(int id, string asunto, string mensajehtml, List<string> destinatarios)
        {
            if (destinatarios.Count == 0)
                return Json(new mensajeJson("No hay dirección de email para enviar", null));
            LeerJson settings = new LeerJson();
            var url = settings.LeerDataJson("App:https") + "/Compras/CCotizacion/Imprimir/" + id;
            var auxdata = await guardarPDFEnviar(id, url);
            if (auxdata.respuesta != "ok")
                return Json(new mensajeJson(auxdata.respuesta, null));
            auxdata.emailsreceptores = destinatarios;
            Email email = new Email();
            var respuesta = email.enviarCorreoArchivoAdjunto(asunto, "", mensajehtml, auxdata);
            return Json(new mensajeJson(respuesta, null));           
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_COTIZACION"))]
        [HttpPost]
        public IActionResult EliminarItemDetalle(int id)
        {
            return Json(EF.EliminarItemDetalle(id));
            
        }
         
        [HttpPost]
        public  IActionResult getBonificacion(int id)
        {
            return Json(EF.getBonificacion(id));

        }
        [HttpPost]
        public async Task<IActionResult> guardarBonificacion(CBonificacionCotizacion[] array,int iddetalle)
        {
            return Json(await EF.guardarBonificacionAsync(array,iddetalle));
        }

        public IActionResult GetProformas(int[] proformas)
        {
            try
            {
                List<string> data = new List<string>();               
                for (int i = 0; i < proformas.Length; i++)
                {
                    var aux = DAO.getCotizacionCompleta(proformas[i]);
                    var tabla = JsonConvert.SerializeObject(aux);
                    data.Add(tabla);
                }
                return Json(data);
            }
            catch (Exception )
            {
                return Json("[]");
            }
        }   
        public async Task<IActionResult> UsarProforma(int[] proformas)
        {
            return Json(await EF.UsarProformaAsync(proformas));

        }

        public async Task<IActionResult> BuscarProveedorCotizacion(int idproforma)
        {
            return Json(await EF.BuscarProveedorCotizacionAsync(idproforma));

        }
        public IActionResult BuscarDatosProveedor(int idproveedor)
        {
            //return Json(EF.BuscarDatosProveedor(idproveedor));
            var data = DAO.BuscarDatosProveedor(idproveedor);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> BuscarPrimeraCotizacion(int idproforma)
        {
            return Json(await EF.BuscarPrimeraCotizacionAsync(idproforma));

        }
        public IActionResult BuscarUltimaCompraxProducto(int idproducto)
        {
            var data = DAO.BuscarUltimaCompraxProducto(idproducto);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult GetEmailEnvio(int id)
        {
            try
            {
                var orden = db.CCOTIZACION.Find(id);
                List<string> correos = new List<string>();
                if (orden.emp_codigo != 0)
                {
                    var empleado = db.EMPLEADO.Find(orden.emp_codigo);
                    if (empleado != null && empleado.email != null)
                        correos.Add($"empleado|{ empleado.email}");
                }
                if (orden.idrepresentante != null || orden.idrepresentante != 0)
                {
                    var representante = db.CREPRESENTANTELABORATORIO.Find(orden.idrepresentante);
                    if (representante != null && representante.correo != null)
                        correos.Add($"representante laboratorio|{ representante.correo}");
                }
                if (orden.idcontacto != null || orden.idcontacto != 0)
                {
                    var contacto = db.CCONTACTOPROVEEDOR.Find(orden.idcontacto);
                    if (contacto != null && contacto.correo != null)
                        correos.Add($"contacto proveedor|{ contacto.correo}");
                }
                if (orden.idcontacto != null || orden.idcontacto != 0)
                {
                    var proveedor = db.CPROVEEDOR.Find(orden.idproveedor);
                    if (proveedor != null && proveedor.email != null)
                        correos.Add($"proveedor|{ proveedor.email}");
                }
                return Json(correos);
            }
            catch (Exception )
            {

                return Json(new List<string>());
            }


        }
        private async Task datosiniciocotizacionAsync()
        {
            var model = await EF.datosiniciocotizacionAsync();
            ViewBag.monedas = model.monedas;
            ViewBag.condicionpago = model.condicionpago;
            ViewBag.tipoproducto = model.tipoproducto;            
            ViewBag.tipopago = model.tipopago;
            ViewBag.IGV = model.IGV;
            ViewBag.tipocotizacion = model.tipocotizacion;
            ViewBag.icoterms = model.icoterms;
        }

        public IActionResult GetUnidadMedida()
        {
            var data = JsonConvert.SerializeObject(DAO.GetUnidadMedida());
            return Json(data);
        }
    }
}