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
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using System.Data;
using OfficeOpenXml;
using RestSharp;
using OfficeOpenXml.Style;
using System.Globalization;

namespace ERP.Areas.Ventas.Controllers
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    //      roles
    //FACTURAR FUERA DE FECHA -> para editar la fecha de la venta al momento de registrar la venta
    public class VentaController : _baseController
    {
        private readonly ICajaVentaEF cajaEF;
        private readonly IVentaEF EF;
        private readonly VentaDAO DAO;
        private readonly GuiaSalidaDAO GuiaSalidaDAO;
        private readonly Modelo db;
        private readonly IConverter pdf;
        private readonly LeerJson settings;
        private readonly IWebHostEnvironment ruta;
        public VentaController(IWebHostEnvironment ruta_, Modelo _db, IConverter pdf_, ICajaVentaEF _cajaEF, IVentaEF _EF, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            cajaEF = _cajaEF;
            db = _db;
            EF = _EF;
            pdf = pdf_;
            ruta = ruta_;
            settings = new LeerJson();
            DAO = new VentaDAO(settings.GetConnectionString());
            GuiaSalidaDAO = new GuiaSalidaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR VENTA DIRECTA")]
        public IActionResult VentaDirecta(long? idventa, string tipo, string guiasalida)
        {
            ViewBag.IGV = db.CCONSTANTE.Find("IGV").valor;
            ViewBag.Monedas = db.FMONEDA.Where(x => x.estado == "HABILITADO").ToList();
            ViewBag.Tipopagos = db.FTIPOPAGO.Where(x => x.estado == "HABILITADO").ToList();
            ViewBag.IDEMPRESA = getEmpresa();
            ViewBag.IDSUCURSAL = getIdSucursal();
            if (tipo == "manual")
            {
                var serieNumdocumento = EF.ObtenerUltimoSerieNumDocumentoManual(getIdSucursal());
                ViewBag.serie = serieNumdocumento[0];
                ViewBag.numdocumento = serieNumdocumento[1];
                ViewBag.tipoventa = "MANUAL";
            }
            else
                ViewBag.tipoventa = "DIRECTA";

            datosinicio();
            if (idventa is null)
            {
                ViewBag.verificarcaja = cajaEF.VerificarAperturaCaja(getIdEmpleado().ToString());
                return View();
            }
            else
            {
                ViewBag.verificarcaja = new mensajeJson("ok", null);
                var venta = db.VENTA.Find(idventa.Value);
                if (venta is null)
                    return NotFound();
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    if (venta.idsucursal != getIdSucursal())
                        return NotFound();
                return View(venta);
            }
        }

        public IActionResult Dashboard()
        {
            datosinicio();
            return View();
        }
        public IActionResult ImprimirTicket(int id)
        {
            var data = DAO.GetVentaCompleta(id);
            return View(data);
        }
        public IActionResult ImprimirTicket_D(int id) {
            var data = DAO.GetVentaCompleta_D(id);
            return View(data);
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL DE VENTAS")]
        public IActionResult HistorialVentas()
        {
            datosinicio();
            return View();
        }
        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR VENTA DIRECTA")]
        public async Task<IActionResult> VentaDirecta(Venta venta)
        {
            //EARTC1001
            venta.idsucursal = getIdSucursal();
            venta.idempleado = getIdEmpleado();
            venta.idempresa = getEmpresa();
            //venta.idpromopack = venta.idpromopack != 0 ? venta.idpromopack : null;//EARTCOD1009
            return Json(await EF.RegistrarVentaDirectaAsync(venta));
        }
        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR VENTA MANUAL")]
        public async Task<IActionResult> VentaManual(Venta venta)
        {

            venta.idsucursal = getIdSucursal();
            venta.idempleado = getIdEmpleado();
            venta.idempresa = getEmpresa();
            return Json(await EF.RegistrarVentaManualAsync(venta));
        }
        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR, ANULAR VENTA")]
        public async Task<IActionResult> AnularVenta(long idventa)
        {
            return Json(await EF.AnularVenta(idventa));
        }
       
        public class ventamodel { 
            public string path { get; set; }
            public int idventa { get; set; }
        }
        public async Task<IActionResult> GenerarTxtVenta(long idventa)
        {
            try
            {
                var res = "";
                int idempresa = getEmpresa();

                var venta = db.VENTA.Find(idventa);

                int idsucursal = venta.idsucursal;
                DataTable dtresult = DAO.GetDatosFacturador(idsucursal);
                int idfacturador = Convert.ToInt32(dtresult.Rows[0][0]);
                if (idfacturador == 2)
                {
                    string t, r;
                    r = dtresult.Rows[0][1].ToString();
                    t = dtresult.Rows[0][2].ToString();
                    res = await NUBEFACT(idventa, r, t);
                }

                if (idfacturador == 1)
                {
                    //aca for         442248
                    //for (long i = 441157;i< 442248; i++) {
                    //    var ventaf = db.VENTA.Find(i);
                    //    if (ventaf is null) { } else {
                    //        var documentof = db.FDOCUMENTOTRIBUTARIO.Find(ventaf.iddocumento);
                    //        if (documentof.codigosunat == "01" || documentof.codigosunat == "03") {
                    //            var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{ventaf.idempresa}\\CPE\\TXT\\";
                    //            res = await DAO.generarTextTxtAsync(i, path);

                    //        }
                    //    }
                    //}
                    var documento = db.FDOCUMENTOTRIBUTARIO.Find(venta.iddocumento);
                    if (documento.codigosunat == "01" || documento.codigosunat == "03")
                    {
                        var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{venta.idempresa}\\CPE\\TXT\\";
                        //AÑADIDO

                        LeerJson settings = new LeerJson();
                        string endpoint = "";
                        endpoint = settings.LeerDataJson("apisperu:urldni");
                        endpoint += "persona/VentasTXT/";

                        var url = new RestClient(endpoint);
                        var senddata = new ventamodel();
                        senddata.path = path;
                        senddata.idventa = Convert.ToInt32(idventa);

                        var body = JsonConvert.SerializeObject(senddata);
                        var request = new RestRequest();
                        request.Method = Method.Post;
                        request.AddHeader("content-Type", "application/json");
                        request.AddParameter("application/json", senddata, ParameterType.RequestBody);
                        var response = url.Execute(request);
                        if (response.StatusCode.ToString() == "OK")
                        { 
                            res =JsonConvert.DeserializeObject(response.Content).ToString();
                        }
                        else
                        {
                            res = "No se puedo conectar con el servidor remoto(API)";
                        }



                        //res = await DAO.generarTextTxtAsync(idventa, path);

                        if (res == "ok")
                        {
                            venta.txtgenerado = true;
                            venta.iseditable = false;
                            db.Update(venta);
                            db.SaveChanges();
                        }
                    }
                }

                return Json(res);
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }

        /// # RUTA para enviar documentos
        //public const string rutan = "https://api.nubefact.com/api/v1/cbe82460-eb5b-4022-9011-68f93b1276b6";

        /// # TOKEN para enviar documentos
        //public const string token = "5f5fb532edbd400d82eb55df9645c06d0ed0df5aea714025ac4c6681ed1cc5a2";
        public async Task<string> NUBEFACT(long idventa, string ruta_, string token_) {
            var venta = db.VENTA.Find(idventa);
            if (venta.iddocumento==1008) {
                return "DI" ;
            }
            var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{venta.idempresa}\\CPE\\TXT\\";
            var res =await DAO.generarTXTNubefactAsync(idventa, path);
            string json_de_respuesta="";
            if (res is not null) {
                StreamReader sr = new StreamReader(path + res);
                string txt_sin_codificar = sr.ReadToEnd();
                byte[] txt_bytes = Encoding.Default.GetBytes(txt_sin_codificar);
                string txt_en_utf_8 = Encoding.UTF8.GetString(txt_bytes);
                sr.Close();
                json_de_respuesta = SendJson(ruta_, txt_en_utf_8, token_);
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

        public async Task<IActionResult> GetHistorialVentas(string fechainicio, string fechafin, string sucursal, string numdocumento,string cliente, int top)
        {
            // retorno data correcto
            // carga lenta de data
            string divisor = "|";
            //string[] sedes = sucursal.Split(divisor);
            //string[] tdocs=
            if (sucursal is null)
                //if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                //{
                    sucursal = getIdSucursal().ToString();
            
                //}
            var data = await DAO.HistorialVentasAsync(fechainicio, fechafin, sucursal, numdocumento, cliente, top);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GetVentasMatrizParaNC(string cliente, string producto, string lote, int idsucursal)
        {
            if (idsucursal == 0)
            {
                string sucursalString = getIdSucursal().ToString();
                // if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                //{
                idsucursal = int.Parse(sucursalString);
            }
            var data = await DAO.BuscarFacturasMatrizParaNC(cliente, producto, lote,idsucursal);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GetDetalleVentasMatrizParaNC(string idventa)
        {
            var data = await DAO.BuscarDetalleVentaMatrizParaNC(idventa);
            return Json(JsonConvert.SerializeObject(data));
        }


        //-------------CODIGO YEXSON-----


        public async Task<IActionResult> GetHistorialVentaslistarArray(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();

            var rows = await DAO.HistorialVentasArrayAsync(numdocumento, cliente, fechainicio, fechafin, sucursal);
            return Json(new { rows });
        }
        //CODIGO EXPORTAR EXCEL
        public IActionResult GetEpllusexportarExcel(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();
            DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


            // Convertir el DateTime a string 'dia/mes/año'
            fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
            fechafin = fechaFinDT.ToString("dd/MM/yyyy");

            try
            {
                var dataArray = DAO.exportarexcelEpplus(numdocumento, cliente, fechainicio, fechafin, sucursal);

                using (ExcelPackage package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Reporte");

                    var rows = new List<object[]>();
                    for (int row = 0; row < dataArray.GetLength(0); row++)
                    {
                        object[] currentRow = new object[dataArray.GetLength(1)];
                        for (int col = 0; col < dataArray.GetLength(1); col++)
                        {
                            currentRow[col] = dataArray[row, col];
                        }
                        rows.Add(currentRow);
                    }

                    // Usando la función LoadFromArrays de EPPlus
                    worksheet.Cells["A1"].LoadFromArrays(rows);

                    // Ajustar el ancho de las columnas al contenido
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Agregar formato de tabla
                    var tableRange = worksheet.Cells[1, 1, dataArray.GetLength(0), dataArray.GetLength(1)];
                    var table = worksheet.Tables.Add(tableRange, "ReporteTable");
                    table.ShowHeader = true;
                    table.TableStyle = OfficeOpenXml.Table.TableStyles.Medium1;

                    // Cambiar el color de fondo de la cabecera a verde
                    using (var headerCells = worksheet.Cells[1, 1, 1, dataArray.GetLength(1)])
                    {
                        headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        headerCells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Green);
                        headerCells.Style.Font.Color.SetColor(System.Drawing.Color.White); // Color de texto blanco para mejor contraste
                    }

                    // (Puedes agregar más configuraciones de estilo aquí si lo deseas)

                    var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    var excelFileName = "reporte.xlsx";

                    var stream = new MemoryStream(package.GetAsByteArray());
                    return new FileContentResult(stream.ToArray(), contentType)
                    {
                        FileDownloadName = excelFileName
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return RedirectToAction("Error", "Home");
            }
        }


            //------------------------FIN DE CODIGO-------------------------



        public IActionResult GetVentaCompleta(int idventa)
        {
            var data = DAO.GetVentaCompleta(idventa);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult GetVentaCompletaParaNotaCD(long idventa)
        {
            try
            {
                var venta = db.VENTA.Find(idventa);
                if (venta is null)
                    return Json(new mensajeJson("No existe venta", null));
                if (venta.estado != "HABILITADO")
                    return Json(new mensajeJson($"La venta esta {venta.estado}", null));
                if (venta.fecha.Value.AddDays(31) <= DateTime.Now)
                    return Json(new mensajeJson("ha pasado la fecha para entregarse la NC", null));
                var documento = db.FDOCUMENTOTRIBUTARIO.Find(venta.iddocumento);
                if (documento.codigosunat == "03" || documento.codigosunat == "01")
                {
                    var data = DAO.GetVentaCompleta(idventa);
                    return Json(new mensajeJson("ok", JsonConvert.SerializeObject(data)));
                }
                else
                    return Json(new mensajeJson("El documento tiene que ser FACTURA o BOLETA", null));
            }
            catch (Exception e)
            {
                return Json(new mensajeJson(e.Message, null));

            }
        }
        [HttpPost]
        public IActionResult GenerarPDFTicket(string url)
        {
            try
            {
                //
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalTicket(url, Request.Cookies, "ticketventa");
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
        public IActionResult GenerarPDFTicket_D(string url) {
            try {
                //
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "Venta", "vertical");
                //var document = generarPDF.GenererarPDFVerticalTicket(url, Request.Cookies, "ticketventa");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);

            }
            catch (Exception) {
                return BadRequest();
            }
        }
        [HttpPost]
        public async Task<IActionResult> GenerarExcelVentas(string fechainicio, string fechafin, string sucursal, string numdocumento,string cliente, int top)
        {
            if (sucursal is null)              
                sucursal = getIdSucursal().ToString();
            return Json(await DAO.GenerarExcelVentasAsync(fechainicio, fechafin, sucursal, numdocumento,cliente, top, ruta.WebRootPath));
            //btnexportar.Attributes["disabled"] = "false";
            //btnexportar.Attributes["style.background"] = "#3f923f";
        }
        [HttpPost]
        public IActionResult GetHistorialClientes(string fechainicio, string fechafin, int idcliente, int top)
        {
            var data = DAO.HistorialClientes(fechainicio, fechafin, idcliente, top);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult VerificarAperturaCaja()
        {
            var msj = cajaEF.VerificarAperturaCaja(getIdEmpleado().ToString());
            return Json(msj);
        }

        public async Task<IActionResult> GetGuiasSalida(string guiasSalidas)
        {
            string[] aGuiasSeparadas = guiasSalidas.Split('_');
            List<object> datos = new List<object>();
            for (int i = 0; i < aGuiasSeparadas.Length; i++)
            {
                var data = await GuiaSalidaDAO.getGuiaSalidaCompletaParaVentas(aGuiasSeparadas[i]);
                datos.Add(data.objeto);
            }
            return Json(datos);
        }
    }
}
