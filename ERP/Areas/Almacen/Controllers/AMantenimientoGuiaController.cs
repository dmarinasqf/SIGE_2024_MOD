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
using Erp.Persistencia.Servicios.Users;
using ENTIDADES.Generales;
using Newtonsoft.Json;
using RestSharp;
using Erp.AppWeb.Models.Horizont;
using System.Data;
using System;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AMantenimientoGuiaController : _baseController
    {
        private readonly IMantenimientoGuiaEF EF;
        private readonly MantenimientoGuiaDAO DAO;
        private readonly GuiaSalidaDAO DAOGSalida;
        private readonly IUser user;

        public AMantenimientoGuiaController(IMantenimientoGuiaEF context, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            user = _user;
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new MantenimientoGuiaDAO(settings.GetConnectionString());
            DAOGSalida = new GuiaSalidaDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = ("ADMINISTRADOR, MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            await datosinicioAsync();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> RegistrarEditar(int? id)
        {
            datosinicio();
            await datosinicioAsync();
            AGuiaSalida guia = new AGuiaSalida();
            guia.idguiasalida = 0;
            //guia.empresa = new Empresa { descripcion = Request.Cookies["EMPRESA"].ToString() };
            //guia.sucursal = new SUCURSAL { descripcion = Request.Cookies["SUCURSAL"].ToString() };
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
        [Authorize(Roles = ("ADMINISTRADOR, MANTENIMIENTO GUIA"))]
        public IActionResult ImprimirGuia(string id)
        {
            datosinicio();
            var data = DAO.getTablaGuiasSalidaImpresion(id);
            //QR
            DataTable cab = new DataTable();

            cab = (DataTable)JsonConvert.DeserializeObject(data.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
            datosinicio();
            string serie = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(0, 4);
            string correlativo = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(4, 8);
            string ruc = cab.Rows[0]["RUCSALIDA"].ToString().Trim();
            string tpguia = cab.Rows[0]["TIPOGUIADOC"].ToString().Trim();
            string qr = AMantenimientoGuiaController.returnQRGuia(ruc, tpguia, serie, correlativo);

            DataColumn column = new DataColumn("QR", typeof(string));
            ASalidaTransferenciaController.QR obj = new ASalidaTransferenciaController.QR();
            obj.qr = qr;
            column.DefaultValue = "[" + JsonConvert.SerializeObject(obj) + "]";
            data.Columns.Add(column);
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENIMIENTO GUIA"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AGuiaSalida obj ,string jsondetalleeliminar)
        {
            return Json(await EF.MantenimientoGuiaRegistrarEditarAsync(obj, jsondetalleeliminar));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> AnularDuplicar(AGuiaSalida obj)
        {
            return Json(await EF.AnularDuplicarAsync(obj));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> Anular(int? id)
        {
            return Json(await EF.AnularAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            return Json(await EF.HabilitarAsync(id));
        }
        public async Task<IActionResult> ListarGuiasSalida(string codigo, string idsucursalorigen, string idsucursaldestino, string fecha, string estado)
        {
            return Json(await DAO.getGuiaSalida(codigo, idsucursalorigen, idsucursaldestino, fecha, estado));
        }
        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.sucursales = modelo.sucursal;
            ViewBag.almacensucursal = modelo.almacensucursal;
        }
        public IActionResult ImprimirPreGuia(string id)
        {
            datosinicio();
            var data =DAO.getTablaPreGuiasSalidaImpresion(id);

            DataTable cab = new DataTable();

            cab = (DataTable)JsonConvert.DeserializeObject(data.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
            datosinicio();
            string serie = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(0, 4);
            string correlativo = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(4, 8);
            string ruc = cab.Rows[0]["RUCSALIDA"].ToString().Trim();
            string tpguia = cab.Rows[0]["TIPOGUIADOC"].ToString().Trim();
            string qr = AMantenimientoGuiaController.returnQRGuia(ruc, tpguia, serie, correlativo);

            DataColumn column = new DataColumn("QR", typeof(string));
            ASalidaTransferenciaController.QR obj = new ASalidaTransferenciaController.QR();
            obj.qr = qr;
            column.DefaultValue = "[" + JsonConvert.SerializeObject(obj) + "]";
            data.Columns.Add(column);
            //QR
            //returnQRGuia("20523915399","09","T002", "00000149");

            return View(data);
        }
        public IActionResult ImprimirGuiaCliente(string id)
        {
            datosinicio();
            var data = DAO.getTablaPreGuiasSalidaImpresion(id);
            var dataTrans = DAOGSalida.GuiaTransportistaH(Convert.ToInt64(id),"");

            //DataTable cabTrans = new DataTable();
            //cabTrans = (DataTable)JsonConvert.DeserializeObject(data2.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));

            DataTable cab = new DataTable();
            cab = (DataTable)JsonConvert.DeserializeObject(data.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
            string serie = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(0, 4);
            string correlativo = cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(4, 8);
            string ruc = cab.Rows[0]["RUCSALIDA"].ToString().Trim();
            string tpguia = cab.Rows[0]["TIPOGUIADOC"].ToString().Trim();
            string qr = AMantenimientoGuiaController.returnQRGuia(ruc, tpguia, serie, correlativo);

            DataColumn column = new DataColumn("QR", typeof(string));
            ASalidaTransferenciaController.QR obj = new ASalidaTransferenciaController.QR();
            obj.qr = qr;
            column.DefaultValue = "[" + JsonConvert.SerializeObject(obj) + "]";
            data.Columns.Add(column);

            DataColumn column2 = new DataColumn("CABECERAADICIONAL", typeof(string));
            column2.DefaultValue = dataTrans.Rows[0]["CABECERA"];
            data.Columns.Add(column2);
            //QR
            //returnQRGuia("20523915399","09","T002", "00000149");

            return View(data);
        }
        //ESTO SE CONSUME EN LAS DEMAS GUIAS PARA OBTENER EL QR DEL PORTAL DE HORIZONT Y REDIRECCIONAR 
        public static string returnQRGuia(string ruc,string codigo,string serie, string correlativo) {
            LeerJson settings = new LeerJson();
            string endpoint = "";
            endpoint = settings.LeerDataJson("apisperu:urlhorizont");

            var url = new RestClient(endpoint);
            var request = new RestRequest(ruc+"-"+codigo+"-"+ serie + "-" + correlativo);
            var response = url.ExecuteGet(request);

            // deserializar json a un objeto para poder obtener la respuesta del api  
            var data = JsonConvert.DeserializeObject <RptGuiaHorizont>(response.Content!);
            //recupero solo el valor de qr 
            //string qr = data.valorqr.Substring(22, (data.valorqr).Length - 22);
            //string qr = data.valorqr;
            //return qr;
            return data.valorqruri;
            //return response.ResponseUri.ToString();
        }
    }
}
