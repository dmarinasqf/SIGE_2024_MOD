using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ERP.Models.Ayudas;
using ENTIDADES.Generales;
using Erp.Persistencia.Servicios.Users;
using System.Collections.Generic;
using System;
using Newtonsoft.Json;
using System.IO;
using Erp.Persistencia.Modelos;
using System.Text;
using System.Net;
using ENTIDADES.ventas;
using System.Data;
using RestSharp;
using Erp.SeedWork;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AGuiaSalidaController: _baseController
    {
        private readonly IGuiaSalidaEF EF;
        private readonly GuiaSalidaDAO DAO;
        private readonly IUser user;
        private readonly Modelo db;

        public AGuiaSalidaController(IGuiaSalidaEF context, IUser _user, Modelo _db, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new GuiaSalidaDAO(settings.GetConnectionString());
            user = _user;
            db = _db;
        }
       
        [Authorize (Roles =("ADMINISTRADOR,GUIA GENERAR"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            await datosinicioAsync();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, AUDITORIA GUIA"))]
        public async Task<IActionResult> AuditoriaGuia()
        {
            datosinicio();
            await datosinicioAsync();          
            return View();
        }

        //DISTRIBUCION FALTANTES DE FACTURACION
        [Authorize(Roles = ("ADMINISTRADOR, AUDITORIA GUIA"))]
        public async Task<IActionResult> GuiasEmpresaFaltanteFac()
        {
            datosinicio();
            await datosinicioAsync();
            return View();
        }


        [Authorize(Roles = ("ADMINISTRADOR, GUIAXANALISIS"))]
        public async Task<IActionResult> GuiaXAnalisis()
        {
            datosinicio();
            await datosinicioAsync();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, AUDITORIA GUIA"))]
        public async Task<IActionResult> RegistrarEditar(int? id)
        {
            datosinicio();
            await datosinicioAsync();
            AGuiaSalida guia = new AGuiaSalida();
            guia.idguiasalida = 0;
            guia.empresa = new Empresa { descripcion = Request.Cookies["EMPRESA"].ToString() };
            guia.sucursal = new SUCURSAL { descripcion = Request.Cookies["SUCURSAL"].ToString() };
            guia.empleado = new EMPLEADO { userName = user.getUserNameAndLast() };
            var data = await EF.BuscarAsync(id);
            ViewBag.mensajebusqueda = data.mensaje;
            if (data.mensaje == "nuevo")
                return View(guia);
            else if (data.mensaje == "notfound")
                return NotFound();
            else if (data.mensaje == "ok")
            {
                return View(data.objeto);
            }
            else
                return View(guia);
        }
        [Authorize(Roles = ("ADMINISTRADOR, AUDITORIA GUIA"))]
        public IActionResult AuditoriaGuiaImprimir(string id)
        {
           var data= DAO.getTablaGuiasSalidaImpresion(id);
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,AUDITORIA GUIA"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AGuiaSalida obj,string detalle)
        {          
            var data = await EF.AuditoriaGuiaRegistrarEditarAsync(obj, detalle);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,AUDITORIA GUIA"))]
        [HttpPost]
        public async Task<IActionResult> AuditoriaGuiaRegistrarEditar(AGuiaSalida obj,string detalle)
        {
            return Json(await EF.AuditoriaGuiaRegistrarEditarAsync(obj,detalle));
        }
        public async Task<IActionResult> GenerarGuiasLista(string listaguiajson)
        {
            //public async Task<mensajeJson> GenerarListaGuiaSalida(string listaguiasalidajson)
            //aguiasalida.idempresa = getEmpresa();}
            string idsucursal = getIdSucursal().ToString();
            string idempleado = getIdEmpleado().ToString();
            string idempresa = getEmpresa().ToString();

            var datosparam = new
            {
                idsucursal = idsucursal,
                idempleado = idempleado,
                idempresa = idempresa
            };

            List<AGuiaSalida> listaguias = JsonConvert.DeserializeObject<List<AGuiaSalida>>(listaguiajson);
            string datosparamJson = JsonConvert.SerializeObject(datosparam);
            var res = new mensajeJson();
            if (listaguias[0].idtipoguia == 4)
                res = await EF.RegistrarGuiaCliente(listaguiajson, datosparamJson);
            else
                res = await EF.GenerarListaGuiaSalida(listaguiajson, datosparamJson);

            //var res2 = "";
            //res2=await NUBEFACT(Convert.ToInt32(res.objeto),token, ruta);
            return Json(res);
            
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarGuiaSalidaDesdeVentas(Venta venta)
        {
            venta.idsucursal = getIdSucursal();
            venta.idempleado = getIdEmpleado();
            venta.idempresa = getEmpresa();
            return Json(await EF.RegistrarGuiaSalidaDesdeVentas(venta));
        }

        public async Task<IActionResult> GenerarTxtGuia(long idguia, string tipo)
        {
            try
            {
                var res = "";
                if (tipo == "distribucion")
                {
                    //for (long i = 40204; i < 60384; i++)
                    //{
                    var guia = db.AGUIASALIDA.Find(idguia);
                    //if(guia is not null)
                    //{
                    //if (guia.seriedoc.Substring(0, 1) == "T")
                    //{
                    //var aaa = "";
                    //if (guia.seriedoc + guia.numdoc == "T03800000024" || guia.seriedoc + guia.numdoc == "T03800000029" ||
                    //    guia.seriedoc + guia.numdoc == "T03800000052" || guia.seriedoc + guia.numdoc == "T03800000116" ||
                    //    guia.seriedoc + guia.numdoc == "T03800000136" || guia.seriedoc + guia.numdoc == "T03800000181" ||
                    //    guia.seriedoc + guia.numdoc == "T03800000182" || guia.seriedoc + guia.numdoc == "T03800000183" ||
                    //    guia.seriedoc + guia.numdoc == "T03800000225" || guia.seriedoc + guia.numdoc == "T03800000226" ||
                    //    guia.seriedoc + guia.numdoc == "T03800000292" || guia.seriedoc + guia.numdoc == "T03800000341")
                    //{
                    //    aaa = "ESTE";
                    //}
                    var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{guia.idempresa}\\CPE\\TXT\\";
                    res = await GenerarGuiasTxt(idguia, tipo, path);
                    if (res == "ok")
                    {
                        //guia.txtgenerado = true;
                        db.Update(guia);
                        db.SaveChanges();
                        //totalRegistrosOk += 1;
                    }
                    //else
                    //{
                    //documentosFaltantes += guia.seriedoc + guia.numdoc + "_";
                    //}
                }
                //}
                //}
                //var abc = totalRegistrosOk;
                //var krpe = documentosFaltantes;
                //}
                else if (tipo == "transferencia")
                {

                    //for (long i = 92489; i < 113133; i++)
                    //{
                    var guia = db.ASALIDATRANSFERENCIA.Find(idguia);
                    //if (guia is not null)
                    //{
                    //if (guia.seriedoc.Substring(0, 1) == "T")
                    //{
                    //var aaa = "";
                    //if (guia.seriedoc + guia.numdoc == "T02000000207")
                    //{
                    //    aaa = "ESTE";
                    //}
                    var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}{guia.idempresa}\\CPE\\TXT\\";
                    res = await GenerarGuiasTxt(idguia, tipo, path);
                    if (res == "ok")
                    {
                        //guia.txtgenerado = true;
                        db.Update(guia);
                        db.SaveChanges();
                        //totalRegistrosOk += 1;
                    }
                    //else
                    //{
                    //documentosFaltantes += guia.seriedoc + guia.numdoc + "_";
                    //}
                    //}
                }
                //}
                //var abc = totalRegistrosOk;
                //var krpe = documentosFaltantes;
                //}

                return Json(res);
            }
            catch (Exception vex)
            {
                return Json(vex.Message);
            }
        }

        public async Task<string> GenerarGuiasTxt(long idguia, string tipo, string path)
        {
            List<string> lista = new List<string>();
            lista.Add("Remitente");
            List<string> rpt = new List<string>();
            int x = 0;
            for (int i = 0; i < lista.Count; i++)
            {
                DataTable dataTable;
                if (lista[i] == "Remitente")
                {
                    x = 0;
                    dataTable = DAO.GuiaRemitenteH(idguia, tipo);
                }
                else
                {
                    x = 1;
                    dataTable = DAO.GuiaTransportistaH(idguia, tipo);
                }
                DataTable cabecera = new DataTable();
                DataTable detalle = new DataTable();
                cabecera = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
                detalle = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["DETALLE"].ToString(), (typeof(DataTable)));


                LeerJson settings = new LeerJson();
                string endpoint = "";
                endpoint = settings.LeerDataJson("apisperu:urldni");
                endpoint += "persona/GuiasTXT/";

                var url = new RestClient(endpoint);
                var senddata = new model();
                senddata.tipo = "Guia";
                senddata.detcab_ = JsonConvert.SerializeObject(cabecera);
                senddata.dtdet_ = JsonConvert.SerializeObject(detalle);
                senddata.x = x;
                senddata.idempresa = getEmpresa();

                var body = JsonConvert.SerializeObject(senddata);
                var request = new RestRequest();
                request.Method = Method.Post;
                request.AddHeader("content-Type", "application/json");
                request.AddParameter("application/json", senddata, ParameterType.RequestBody);
                var response = url.Execute(request);
                if (response.StatusCode.ToString() == "OK")
                {
                    rpt.Add("ok");
                }
                else
                {
                    rpt.Add("No se puedo conectar con el servidor remoto(API)");
                }


                //rpt.Add(DAO.generarTextTxtAsync(x, path, dataTable));



            }
            for (int i = 0; i < rpt.Count; i++)
            {
                var res = "";
                res = rpt[i];
                if (res != "ok")
                {
                    return res;
                }
            }
            return "ok";

        }
        public class model
        {
            public string tipo { get; set; }
            public string detcab_ { get; set; }
            public string dtdet_ { get; set; }
            public int x { get; set; }
            public int idempresa { get; set; }
        }
        /*   
        public async Task<string> NUBEFACT(long idguiasalida, string tipo)
        {

            var path = $"{db.CCONSTANTE.Find("PATHTXTHORIZONTE").valor}\\CPE\\TXTGUIA\\";

            var res = await DAO.generarGuiaNubefact(idguiasalida,path,tipo);

            string json_de_respuesta = "";
            if (res is not null)
            {
                for (int i = 0; i < res.Count; i++) {
                    json_de_respuesta = SendJson(ruta, res[i], token);
                }
            }
            return json_de_respuesta;
        } */
        static string SendJson(string ruta, string json, string token)
        {
            try
            {
                using (var client = new WebClient())
                {
                    /// ESPECIFICAMOS EL TIPO DE DOCUMENTO EN EL ENCABEZADO
                    client.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                    /// ASI COMO EL TOKEN UNICO
                    client.Headers[HttpRequestHeader.Authorization] = "Token token=" + token;
                    /// OBTENEMOS LA RESPUESTA
                    string respuesta = client.UploadString(ruta, "POST", json);
                    /// Y LA 'RETORNAMOS'
                    return respuesta;
                }
            }
            catch (WebException ex)
            {
                /// EN CASO EXISTA ALGUN ERROR, LO TOMAMOS
                var respuesta = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                /// Y LO 'RETORNAMOS'
                return respuesta;
            }
        }

        public async Task<IActionResult> ListarSucursalDistribuir(string idproducto,string rango,string sucursales,int tipo)
        {
            return Json(await DAO.getSucursalDistribucion(idproducto,rango, sucursales,tipo));
        }
        public async Task<IActionResult> ListarGuiasSalida(string codigo,string idsucursalorigen, 
            string idsucursaldestino, string fechainicio, string fechafin, string estadoguia,int top, int idtipoguia)
        {
            return Json(await DAO.getGuiaSalida(codigo, idsucursalorigen, idsucursaldestino, fechainicio,fechafin, estadoguia,top, idtipoguia));
        }
        
        public async Task<IActionResult> GetGuiaCompleta(string id)
        {
            return Json(await DAO.getGuiaSalidaCompleta(id));
        }
        public async Task<IActionResult> ListarGuiasSalidaPorCargar(string codigo,string idsucursalorigen, string idsucursaldestino, string estado)
        {
            return Json(await DAO.getGuiaSalidaPorCargar(codigo, idsucursalorigen, idsucursaldestino, estado));
        }
        public IActionResult BuscarCodigosGuiasDistribucion(string fechainicio, string fechafin, string estadoguia)
        {
            var data = JsonConvert.SerializeObject(DAO.getCodigosGuiasDistribucion(fechainicio, fechafin, estadoguia));
            return Json(data);
        }
        public async Task<IActionResult> ListarTipoGuia()
        {
            var data = JsonConvert.SerializeObject(await DAO.ListarTipoGuia());
            return Json(data);
        }

        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.subclases = modelo.subclase;
            ViewBag.sucursales = modelo.sucursal;             
        }

        //Cargar Ventas desde los txt's de Horizont
        public IActionResult ConsumirTxt()
        {
            List<CabeceraTxt> lGeneral = new();
            for (int i = 1; i < 146; i++)
            {
                string[] lines = System.IO.File.ReadAllLines(@"C:\txtqf\TXTNUM (" + i + ").txt");

                CabeceraTxt oCabecera = new CabeceraTxt();
                List<DetalleTxt> lDetalle = new();
                foreach (string line in lines)
                {
                    string[] linesSplit = line.Split("|");
                    if (linesSplit[0] == "G")
                    {
                        oCabecera.serie = linesSplit[2];
                        oCabecera.numdocumento = linesSplit[3];
                        oCabecera.fecha = linesSplit[4];
                        oCabecera.idempresa = linesSplit[9];
                        //oCabecera.idsucursal = linesSplit[4];
                        oCabecera.tipoDocumento = linesSplit[1];
                        oCabecera.idcliente = linesSplit[31];
                        oCabecera.nombrecliente = linesSplit[32];
                        oCabecera.total = linesSplit[51];
                        //oCabecera.jsonDetalle = linesSplit[4];
                    }
                    if (linesSplit[0] == "I")
                    {
                        DetalleTxt oDetalle = new DetalleTxt();
                        oDetalle.idproducto = linesSplit[4];
                        oDetalle.cantidad = linesSplit[3];
                        oDetalle.precioconigv = linesSplit[11];
                        //oDetalle.preciosinigv = "";
                        //oDetalle.isfraccion = "";
                        //oDetalle.idstock = "";
                        //oDetalle.idprecioproducto = "";
                        lDetalle.Add(oDetalle);
                    }
                    if (linesSplit[0] == "L" && linesSplit[1] == "1000")
                    {
                        oCabecera.textomoneda = linesSplit[2];
                    }
                }
                string jsonDetalle = JsonConvert.SerializeObject(lDetalle);
                oCabecera.jsonDetalle = jsonDetalle;
                oCabecera.cantidadDetalle = lDetalle.Count;
                lGeneral.Add(oCabecera);
            }
            var aw3 = lGeneral;

            string DocumentosQueNoSeIngresaron = "";
            foreach (var item in lGeneral)
            {
                var result = DAO.InsertarVentasTxt(item);
                if (result != "ok")
                {
                    DocumentosQueNoSeIngresaron += result + "_";
                }
            }

            var arw = DocumentosQueNoSeIngresaron;
            return Json(null);
        }

        //CODIGO DE YEXSON
        public IActionResult listarSucursalesconCheckBoxs(int idempresa)
        {
            var dataTable = DAO.listarSucursalesconCheckBoxs(idempresa);

            // Convertir DataTable a List<Dictionary<string, object>>
            var rows = new List<Dictionary<string, object>>();
            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in dataTable.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                rows.Add(dict);
            }

            return Json(rows);
        }




        // venta prueba 
        public async Task<IActionResult> GetHistorialVentaslistarArray(int rango, string sucursales, int tipo,string almacenes,string laboratorio)
        {
            if (sucursales is null)
                sucursales = getIdSucursal().ToString();
            laboratorio = laboratorio ?? "";

            // Reemplaza las comas con '|' si laboratorio no es vacío y contiene comas
            if (!string.IsNullOrEmpty(laboratorio))
            {
                laboratorio = laboratorio.Contains(",") ? laboratorio.Replace(",", "|") : laboratorio;
            }

            var rows = await DAO.HistorialVentasArrayAsync(rango, sucursales, tipo, almacenes,laboratorio);
            return Json(new { rows });
        }


        // CODIGO PARA LISTAR LABORATORIOS
        public async Task<IActionResult> Getlistar_Laboratorio_Array(string sucursales, string almacenes, string laboratorio)
        {


            var rows = await DAO.Listar_Laboratorio_Array(sucursales, almacenes, laboratorio);
            return Json(new { rows });
        }


        // LISTAR GUIA SALIDA SIN FACTURAR
        public async Task<IActionResult> ListarGuiaSalidaxempresaSinfacturar(string fechainicio , string fechafin,  int idempresa )
        {
            return Json(await DAO.ListarGuiaSalidaxaSinfacturar( fechainicio, fechafin, idempresa));
        }

        // LISTAR GUIA SALIDA SIN FACTURAR DETALL
        public async Task<IActionResult> ListarGuiaDetalleSalidaxempresaSinfacturar(string idguias)
        {
            return Json(await DAO.ListarDetalleGuiaSalidaxaSinfacturar(idguias));
        }
        public async Task<IActionResult> ObtenerSerieGuiaxSucursal(int idsucursal)
        {
            return Json(await DAO.ObtenerSerieGuiaxSucursal(idsucursal));
        }

    }
}
