using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf.Contracts;
using ENTIDADES.ventas;
using ERP.Controllers;
using ERP.Models.Ayudas;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using INFRAESTRUCTURA.Areas.Ventas.notacredito;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Net;
using RestSharp;

namespace ERP.Areas.Ventas.Controllers
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class NotaCDController : _baseController
    {
        private readonly Modelo db;
        private readonly INotacdEF EF;
        private readonly ICajaVentaEF cajaEF;
        private readonly NotaDAO    DAO;
        private readonly IConverter pdf;
        private readonly IWebHostEnvironment ruta;
        public NotaCDController(IWebHostEnvironment _ruta,INotacdEF EF_, IConverter pdf_,ICajaVentaEF _cajaEF,Modelo _db,ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            db = _db;
            EF = EF_;
            pdf = pdf_;
            ruta = _ruta;
            LeerJson settings = new LeerJson();
            DAO = new NotaDAO(settings.GetConnectionString());
            cajaEF = _cajaEF;
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL DE NC Y ND")]
        public IActionResult HistorialNotas()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR NOTA DE CRÉDITO Y DEBITO")]

        public IActionResult RegistrarEditar(int? idnota)
        {
            ViewBag.IGV = db.CCONSTANTE.Find("IGV").valor;
            ViewBag.IDEMPRESA = getEmpresa();
            datosinicio();
            ViewBag.verificarcaja = cajaEF.VerificarAperturaCaja(getIdEmpleado().ToString());
            if (idnota is null)       
            return View();

          var nota = db.NOTACREDITODEBITO.Find(idnota.Value);
            if (nota is null)
                return NotFound();
            if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                if (nota.idsucursal != getIdSucursal())
                    return NotFound();
            ViewBag.verificarcaja = new mensajeJson("ok", null);
            return View(nota);


        }
        public IActionResult ImprimirTicket(int id)
        {
            var data = DAO.GetNotaCompleta(id);
            return View(data);
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR NOTA DE CRÉDITO Y DEBITO")]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(NotaCD nota,int idCajasucursal)
        {
            if (nota.idsucursal == 0)  // Si idsucursal es 0, asumimos que está vacío o nulo
            {
                nota.idsucursal = getIdSucursal();
            }

            if (nota.idempresa == 0)  // Si idempresa es 0, asumimos que está vacío o nulo
            {
                nota.idempresa = getEmpresa();
            }
            return Json(await EF.RegistrarVentaDirectaAsync(nota, idCajasucursal));
        }

        public IActionResult GetNotaCompleta(int idnota)
        {
            var data = DAO.GetNotaCompleta(idnota);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GetHistorialNotas(string fechainicio, string fechafin, string sucursal, string numdocnota,string numdocventa, int top,string cliente)
        {
            if (sucursal is null && (!User.IsInRole("ADMINISTRADOR") || !User.IsInRole("ACCESO A TODAS LAS SUCURSALES")))
            {
                sucursal = getIdSucursal().ToString();
            }
            var data = await DAO.HistorialNotasAsync(fechainicio, fechafin, sucursal, numdocnota,numdocventa, cliente,top);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public IActionResult GenerarPDFTicket(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalTicket(url, Request.Cookies, "ticketnotacredito");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
       
        public async Task<IActionResult> GenerarTxtNota(int idnota)
        {
            try {
                int idempresa = getEmpresa();
                var res = "";
                if (idempresa >= 3000) {
                     res = await NUBEFACT(idnota);
                    return Json(res);
                }
                else {
                    var nota = db.NOTACREDITODEBITO.Find(idnota);
                    var documento = db.FDOCUMENTOTRIBUTARIO.Find(nota.iddocumento);
                    if (nota is null)
                        return Json("No existe venta para generar el TXT");
                    if (documento.codigosunat == "07" || documento.codigosunat == "08") {
                        var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{nota.idempresa}\\CPE\\TXT\\";
                        //var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}";
                       
                        //var res = await DAO.generarTextTxtAsync(idnota, path /*+ nota.idsucursal.ToString()*/);

                        //if (res == "ok") {
                        //    nota.txtgenerado = true;
                        //    nota.iseditable = false;
                        //    db.Update(nota);
                        //    db.SaveChanges();
                        //}

                        LeerJson settings = new LeerJson();
                        string endpoint = "";
                        endpoint = settings.LeerDataJson("apisperu:urldni");
                        endpoint += "persona/NotaTXT/";

                        var url = new RestClient(endpoint);
                        var senddata = new ventamodel();
                        senddata.path = path;
                        senddata.idventa = Convert.ToInt32(idnota);

                        var body = JsonConvert.SerializeObject(senddata);
                        var request = new RestRequest();
                        request.Method = Method.Post;
                        request.AddHeader("content-Type", "application/json");
                        request.AddParameter("application/json", senddata, ParameterType.RequestBody);
                        var response = url.Execute(request);
                        if (response.StatusCode.ToString() == "OK")
                        {
                            res = JsonConvert.DeserializeObject(response.Content).ToString();
                        }
                        else
                        {
                            res = "No se puedo conectar con el servidor remoto(API)";
                        }

                        if (res == "ok") {
                            nota.txtgenerado = true;
                            nota.iseditable = false;
                            db.Update(nota);
                            db.SaveChanges();
                        }
                    }
                    return Json(res);
                }
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }
        public class ventamodel
        {
            public string path { get; set; }
            public int idventa { get; set; }
        }
        /// # RUTA para enviar documentos
        public const string rutan = "https://api.nubefact.com/api/v1/cbe82460-eb5b-4022-9011-68f93b1276b6";

        /// # TOKEN para enviar documentos
        public const string token = "5f5fb532edbd400d82eb55df9645c06d0ed0df5aea714025ac4c6681ed1cc5a2";
        public async Task<string> NUBEFACT(int idnota) {
            var venta = db.NOTACREDITODEBITO.Find(idnota);
            var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{venta.idempresa}\\CPE\\TXT\\";
            var res = await DAO.generarTXTNubefactAsync(idnota, path);
            string json_de_respuesta = "";
            if (res is not null) {
                StreamReader sr = new StreamReader(path + res);
                string txt_sin_codificar = sr.ReadToEnd();
                byte[] txt_bytes = Encoding.Default.GetBytes(txt_sin_codificar);
                string txt_en_utf_8 = Encoding.UTF8.GetString(txt_bytes);
                sr.Close();
                json_de_respuesta = SendJson(rutan, txt_en_utf_8, token);
            }
            return json_de_respuesta;
        }
        static string SendJson(string ruta, string json, string token) {
            try {
                using (var client = new WebClient()) {
                    /// ESPECIFICAMOS EL TIPO DE DOCUMENTO EN EL ENCABEZADO
                    client.Headers[HttpRequestHeader.ContentType] = "text/plain";
                    /// ASI COMO EL TOKEN UNICO
                    client.Headers[HttpRequestHeader.Authorization] = "Token token=" + token;
                    /// OBTENEMOS LA RESPUESTA
                    string respuesta = client.UploadString(ruta, "POST", json);
                    /// Y LA 'RETORNAMOS'
                    return "ok";
                }
            }
            catch (WebException ex) {
                /// EN CASO EXISTA ALGUN ERROR, LO TOMAMOS
                var respuesta = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                /// Y LO 'RETORNAMOS'
                return respuesta;
            }
        }
        public async Task<IActionResult> GenerarExcelNotas(string fechainicio, string fechafin, string sucursal, string numdocnota, string numdocventa, int top, string cliente)
        {
            if (sucursal is null && (!User.IsInRole("ADMINISTRADOR") || !User.IsInRole("ACCESO A TODAS LAS SUCURSALES")))
            {
                sucursal = getIdSucursal().ToString();
            }
            return Json(await DAO.GenerarExcelNotasAsync(fechainicio, fechafin, sucursal, numdocnota, numdocventa, cliente, top, ruta.WebRootPath));

        }
        public async Task<IActionResult> VerificarSiVentaTieneNota(long idventa)
        {
            return Json(await EF.VerificarSiVentaTieneNotaAsync(idventa));

        }
        public async Task<IActionResult> BuscarVentaNotaCD(BuscarVentaParaNC.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));

        }

        public async Task<IActionResult> BuscarVentaNotaCD_v1(int idventa, string idproductos)
        {
            return Json(await DAO.BuscarVentaNotaCD_v1( idventa,  idproductos));


        }
    }
}
