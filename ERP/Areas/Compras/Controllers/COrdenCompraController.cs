using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using System.Collections.Generic;
using Rotativa.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Rotativa.AspNetCore.Options;
using System.IO;
using MimeKit;
using Newtonsoft.Json;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using Erp.Persistencia.Servicios;
using DocumentFormat.OpenXml.EMMA;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using DinkToPdf.Contracts;
using Erp.Persistencia.Servicios.Users;
using System.Data;
using Newtonsoft.Json.Linq;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    /// <summary> 
    ///PERFILES
    ///APROBAR ORDEN DE COMPRA       -- APROBAR ORDEN COMPRA
    ///M_COMPRAS_ORDEN
    /// </summary>

    public class COrdenCompraController : _baseController
    {
        private readonly Modelo db;
        private readonly IOrdenCompraEF EF;
        private readonly IWebHostEnvironment ruta;
        private readonly OrdenCompraDAO DAO;
        private readonly PreingresoDAO preingresoDAO;
        private readonly IConverter pdf;
        private readonly IUser user;
        public COrdenCompraController(Modelo context, IUser _user, IWebHostEnvironment _webHostEnvironment, IOrdenCompraEF _EF, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, IConverter _pdf) : base(cryptografhy, signInManager)
        {
            db = context;
            ruta = _webHostEnvironment;
            EF = _EF;
            pdf = _pdf;
            user = _user;
            LeerJson settings = new LeerJson();
            DAO = new OrdenCompraDAO(settings.GetConnectionString());
            preingresoDAO = new PreingresoDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        public IActionResult Index()
        {
            datosinicio();

            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        public async Task<IActionResult> RegistrarEditar(string? id)
        {
            await datosiniciocotizacionAsync();
            datosinicio();
            if (id is null)
                return View(new COrdenCompra());

            bool tieneD = id.EndsWith("D");
            string parteNumerica = tieneD ? id.TrimEnd('D') : id;
            string letra = tieneD ? "D" : "";

            if (!int.TryParse(parteNumerica, out int numeroId))
            {
                // manejar caso donde la conversión a int falla
                return BadRequest("ID inválido");
            }
            var orden = db.CORDENCOMPRA.Find(numeroId);
            if (letra == "D")
            {
                orden.codigoorden = "DuplicarD";
                orden.estado = "PENDIENTE";
                orden.fechavencimiento = null;

                // Asumiendo que idordenimpreso es una propiedad de tu objeto 'orden'

            }

            if (orden is null)
                return NotFound();
            else
                return View(orden);
        }
        [Authorize(Roles = ("ADMINISTRADOR, APROBAR ORDEN DE COMPRA"))]

        public IActionResult Aprobar()
        {
            DateTime fecha = DateTime.Now;
            ViewBag.fecha = fecha.ToShortDateString();
            datosinicio();

            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(COrdenCompra orden)
        {
            return Json(await EF.RegistrarEditarAsync(orden));
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarItemPorDiferenciaCantidad(string jsondetalle)
        {
            return Json(await EF.RegistrarItemPorDiferenciaCantidad(jsondetalle));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        public async Task<IActionResult> Editar(int id)
        {
            try
            {
                var orden = await db.CORDENCOMPRA.FindAsync(id);
                if (orden is null)
                    return NotFound();
                if (orden.idempresa != getEmpresa())
                    return NotFound("El registro no pertenece a la empresa");
                datosinicio();
                await datosiniciocotizacionAsync();
                //orden = await GetOrdenCompletaAsync(id);
                return View(orden);
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        [HttpPost]
        public async Task<IActionResult> EditarDetalle(int[] detalle)
        {
            return Json(await EF.EditarDetalleAsync(detalle));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        [HttpPost]
        public async Task<IActionResult> AnularOrden(int id)
        {
            return Json(await EF.AnularOrdenAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> BuscarOrdenes(string estado, string id, string sucursaldestino, int top, DateTime? fechainicio, DateTime? fechafin, string proveedor)
        {
            if (sucursaldestino is null || sucursaldestino == "")
            {
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS ORDENES COMPRA"))
                    sucursaldestino = "";
                else
                    sucursaldestino = getIdSucursal().ToString();
            }
            // Si fechainicio o fechafin es null, asigna un valor predeterminado (ejemplo: DateTime.MinValue)
            var data = await DAO.getOrdenesAsync(id, getEmpresa().ToString(), proveedor, estado, sucursaldestino, top, fechainicio ?? DateTime.MinValue, fechafin ?? DateTime.MinValue);
            return Json(JsonConvert.SerializeObject(data));
        }

        [HttpPost]
        public async Task<IActionResult> BuscarOrden(int id)
        {
            var data = await GetOrdenCompletaAsync(id);
            return Json(data);
        }
        public IActionResult Imprimir(int id)
        {
            try
            {
                var orden = db.CORDENCOMPRA.Find(id);
                string uss = user.getUserName();
                if (orden is null)
                    return NotFound();
                if (orden.idempresa != getEmpresa())
                    return NotFound("El registro no pertenece a la empresa");
                var data = ((DAO.getOrdenCompra_mas_boni_CompletaImprimir(id, "")));
                data.Add(JsonConvert.SerializeObject(db.EMPRESA.Find(orden.idempresa)));
                data.Add(JsonConvert.SerializeObject(uss));
                return View(data);

            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        public IActionResult ListarCCostos()
        {
            int idempresa = user.getIdEmpresaCookie();
            var data = DAO.getlistaCCosto(idempresa);
            return Json(data);
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]

        public IActionResult GenerarPDF(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "OrdenCompra", "vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception e)
            {
                return Json(e.Message + "_" + e.ToString());
            }

        }
        private async Task<EmailHelper> guardarPDFEnviar(int id, string url)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    EmailHelper emailaux = new EmailHelper();
                    var orden = db.CORDENCOMPRA.Find(id);

                    if (orden is null)
                        return new EmailHelper { respuesta = "No existe orden compra" };
                    List<string> paths = new List<string>();
                    var fileName = orden.idordencompra + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".pdf";
                    string filePath = Path.GetFullPath(Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\ordenescompra\\"));
                    GenerarPDF generarPDF = new GenerarPDF();
                    var document = generarPDF.GuardarPDFVerticalA4(url, Request.Cookies, filePath, fileName);
                    if (document is null)
                        return new EmailHelper { respuesta = "Error al guardar datos de pdf" };

                    pdf.Convert(document);
                    string path = Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\ordenescompra\\", fileName);
                    paths.Add(path);
                    emailaux.rutasarchivosenviar = paths;
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
            var url = settings.LeerDataJson("App:https") + "/Compras/COrdenCompra/Imprimir/" + id;

            var auxdata = await guardarPDFEnviar(id, url);
            if (auxdata.respuesta != "ok")
                return Json(new mensajeJson(auxdata.respuesta, null));
            auxdata.emailsreceptores = destinatarios;


            Email email = new Email();

            var respuesta = email.enviarCorreoArchivoAdjunto(asunto, "", mensajehtml, auxdata);
            return Json(new mensajeJson(respuesta, null));


        }

        private async Task<COrdenCompra> GetOrdenCompletaAsync(int id)
        {
            try
            {
                var orden = await db.CORDENCOMPRA.FindAsync(id);
                if (orden is null)
                    return null;
                var tarea = await Task.Run(() =>
                {
                    orden = DAO.getCabecera(id);
                    orden.empresa = db.EMPRESA.Find(orden.idempresa);
                    var detalle = DAO.getDetalle(id);
                    orden.detalle = detalle;
                    return orden;
                });
                return tarea;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public IActionResult GetEmailEnvio(int id)
        {
            try
            {
                var orden = db.CORDENCOMPRA.Find(id);
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
            catch (Exception)
            {

                return Json(new List<string>());
            }


        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_ORDEN"))]
        public async Task<IActionResult> AprobarOC(COrdenCompra obj)
        {
            return Json(await EF.AprobarOCAsync(obj));
        }

        public async Task<IActionResult> CargarOrdenCompraMasBonificaciones(string? id, string tipo)
        {
            try
            {
                bool tieneD = id.EndsWith("D");
                string parteNumerica = tieneD ? id.TrimEnd('D') : id;
                string letra = tieneD ? "D" : "";
                if (!int.TryParse(parteNumerica, out int numeroId))
                {
                    // Manejar caso donde la conversión a int falla
                    return BadRequest("ID inválido");
                }

                var orden = await db.CORDENCOMPRA.FindAsync(numeroId);
                if (orden is null)
                    return Json(new mensajeJson("No existe orden", null));
                //if (orden.fechavencimiento <= DateTime.Now.Date)
                //    return Json(new mensajeJson("La orden está vencida", null));

                var tarea = await Task.Run(() =>
                {
                    var detalle = DAO.getDetalleOrdenCompra_mas_Bonificaciones(numeroId, tipo);

                    // Verificar si la letra es 'D' y cambiar CODIGO en la cabecera si es el caso
                    if (tieneD)
                    {
                        foreach (DataRow row in detalle.Rows)
                        {
                            var cabeceraJson = row["Cabecera"].ToString();
                            var cabeceraArray = JsonConvert.DeserializeObject<JArray>(cabeceraJson);

                            // Verificar si hay al menos un elemento en la matriz
                            if (cabeceraArray.Count > 0)
                            {
                                // Accede al primer elemento de la matriz (índice 0)
                                var primerElemento = cabeceraArray[0] as JObject;

                                if (primerElemento != null)
                                {
                                    // Accede a la propiedad "CODIGO" en el objeto de cabecera y cambia su valor
                                    primerElemento["ID"] = "0";
                                    primerElemento["CODIGO"] = "";
                                    primerElemento["ESTADO"] = "PENDIENTE";
                                    primerElemento["FECHA VENCIMIENTO"] = null;
                                    // Puedes cambiar el valor aquí
                                }

                                // Convierte nuevamente la matriz en JSON y actualiza la celda
                                row["Cabecera"] = cabeceraArray.ToString(Formatting.None);
                            }
                        }
                    }

                    return JsonConvert.SerializeObject(detalle);
                });

                return Json(new mensajeJson("ok", tarea));
            }
            catch (Exception e)
            {
                return Json(new mensajeJson(e.Message, null));
            }
        }

        public async Task<IActionResult> ConsultaProductoAnalisis(string proveedor, int producto)
        {
            try
            {
                var obj = await Task.Run(() =>
                {
                    string[] datatables = new string[2];
                    var DATA1 = (DAO.get10ultimasOrdenes(proveedor, producto, getEmpresa().ToString()));
                    var DATA2 = (preingresoDAO.get10ultimaspreingresos(proveedor, producto, getEmpresa().ToString()));
                    datatables[0] = JsonConvert.SerializeObject(DATA1);
                    datatables[1] = JsonConvert.SerializeObject(DATA2);
                    return datatables;
                });

                return Json(obj);
            }
            catch (Exception x)
            {
                return Json(x.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> VerificarCredenciales_OrdenCompra(string usuario, string clave)
        {
            return Json(await EF.VerificarCredenciales_OrdenCompraAsync(usuario, clave));
        }

        private async Task datosiniciocotizacionAsync()
        {
            var modelo = await EF.datosiniciocotizacionAsync();
            ViewBag.monedas = modelo.monedas;
            ViewBag.condicionpago = modelo.condicionpago;
            ViewBag.tipopago = modelo.tipopago;
            ViewBag.sucursales = modelo.sucursales;
            ViewBag.IGV = modelo.IGV;
            ViewBag.PERCEPCION = modelo.PERCEPCION;
            ViewBag.IDALMACENSUCURSAL = modelo.idalmacensucursal ?? 0;
            ViewBag.icoterms = modelo.icoterms;

        }

        public IActionResult ConsultaDetalleCotizacion(int iddetallecotizacion)
        {
            try
            {
                var obj = db.CCOTIZACIONDETALLE.Find(iddetallecotizacion);

                return Json(obj);
            }
            catch (Exception x)
            {
                return Json(x.Message);
            }
        }


        //  se usa par listar enviar el correo de preingreso realizado
        class Objeto
        {
            public string Codigopreingreso { get; set; }
            public string Codigoorden { get; set; }
            public string UsuarioCrea { get; set; }
            public string Email { get; set; }
            public string Asunto { get; set; }
            public string MensajePri { get; set; }
            public string MENSAJEse { get; set; }
            public string mensajebotnes { get; set; }
            public string inicioboton { get; set; }
            public string finboton { get; set; }
            public int idordencompra { get; set; }
            public int idpreingreso { get; set; }
            public int idfactura { get; set; }
            

        }
        public async Task<IActionResult> EnviarEmailPreingresoTerm(int idpreingreso,int id, string urlsistema, string mensajehtml, List<string> destinatarios)
        {

            try {

                var data = DAO.getenviocorreopreingresotem(idpreingreso);

                var jsonStringdata = JsonConvert.SerializeObject(data);
                var listaObjetos = JsonConvert.DeserializeObject<List<Objeto>>(jsonStringdata);
                // Acceder al primer objeto en la lista
                var primer_objeto = listaObjetos[0];
             
                var emailprimario= primer_objeto.Email;

                //var botoncorreo = primer_objeto.inicioboton + urlsistema + "/PreIngreso/PIPreingreso/Registrar/"+ primer_objeto.idpreingreso + "?idfactura="+ primer_objeto.idfactura  + primer_objeto.finboton;
                var botoncorreo = primer_objeto.inicioboton + urlsistema +primer_objeto.finboton;

                var mensajehtml1 = primer_objeto.MensajePri + '\n' + primer_objeto.MENSAJEse + '\n'   + primer_objeto.mensajebotnes + botoncorreo;
                // Acceder al valor específico de "codigopreingreso"

                LeerJson settings = new LeerJson();
                var urlpreingreso = settings.LeerDataJson("App:https") + "/PreIngreso/PIPreingreso/Imprimir/" + primer_objeto.idpreingreso;
                var urlfactura = settings.LeerDataJson("App:https") + "/PreIngreso/PIPreingreso/ImprimirActaRecepcion_V1/" + primer_objeto.idfactura;
               var urlar= urlpreingreso+"|"+urlfactura;
                var auxdata = await generardatospdfcorreopreingreso(primer_objeto.idpreingreso, primer_objeto.Codigopreingreso, primer_objeto.idfactura, urlar);
                if (auxdata.respuesta != "ok")
                    return Json(new mensajeJson(auxdata.respuesta, null));
                if (emailprimario=="")
                {
                    return Json(new mensajeJson("No hay dirección de email para enviar", null));
                }
                else
                {
                    List<string> emaildes = emailprimario.Split(',').ToList();
                    auxdata.emailsreceptores = emaildes;
                }

                Email email = new Email();

                var respuesta = email.enviarCorreoPreingreso(primer_objeto.Asunto, "", mensajehtml1, auxdata);
                return Json(new mensajeJson(respuesta, null));
            }
            catch (Exception e)
            {
                return Json(new mensajeJson("", null));

            }
          
      


        }


        private async Task<EmailHelper>generardatospdfcorreopreingreso(int idpreingreso, string codpreingreso,int idfactura, string urls)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    EmailHelper emailaux = new EmailHelper();
              
                    List<string> paths = new List<string>();
                    var fileNameprimero = "PreingresoCompleto" + "_" + codpreingreso + "_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".pdf";
                    var filesegundo = "FacturaPreingreso_"+idfactura +"_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".pdf";
                    string filePath = Path.GetFullPath(Path.Combine(ruta.WebRootPath + "\\archivos\\pdf\\preingreso\\"));
                    GenerarPDF generarPDF = new GenerarPDF();

                    // Separar las URLs por coma
                    string[] urlArray = urls.Split('|');
                    var nombrearchi = false;
                    foreach (var url in urlArray)
                    {
                        // Asegurarse de que la URL no esté vacía
                        if (!string.IsNullOrWhiteSpace(url))
                        {
                            var fileName = "";
                            if (!nombrearchi)
                            {
                                fileName = fileNameprimero;
                                nombrearchi = true;
                            }else
                            {
                                fileName = filesegundo;
                            }
                            // Generar la ruta completa
                            var document = generarPDF.GuardarPDFVerticalA4(url, Request.Cookies, filePath, fileName);

                            if (document is null)
                                return new EmailHelper { respuesta = "Error al guardar datos de pdf" };

                            pdf.Convert(document);
                            string path = Path.Combine(filePath, fileName);
                            paths.Add(path);
                        }
                    }

                    emailaux.rutasarchivosenviar = paths;
                    emailaux.respuesta = "ok";
                    emailaux.emailsreceptores = new List<string>();
                    emailaux.user = db.CCONSTANTE.Find("CABCORREOALMACEN").valor;
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
    }
}