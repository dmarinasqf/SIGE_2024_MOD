using DocumentFormat.OpenXml.Wordprocessing;
using ENTIDADES.Almacen;
using ENTIDADES.Generales;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Data;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ASalidaTransferenciaController : _baseController
    {
        private readonly ISalidaTransferencia EF;
        private readonly SalidaTransferenciaDAO DAO;
        private readonly IUser user;
        public ASalidaTransferenciaController(ISalidaTransferencia context,IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            user = _user;
            LeerJson settings = new LeerJson();
            DAO = new SalidaTransferenciaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR, SALIDA TRANSFERENCIA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR,SALIDA TRANSFERENCIA"))]
        public async Task<IActionResult> RegistrarEditar(int? id)
        {
            datosinicio();
            await datosinicioAsync();
            ASalidaTransferencia salida = new ASalidaTransferencia();
            salida.idsalidatransferencia = 0;
            salida.empresa = new Empresa { descripcion = Request.Cookies["EMPRESA"].ToString() };
            salida.sucursal = new SUCURSAL { descripcion = Request.Cookies["SUCURSAL"].ToString() };
            salida.empleado = new EMPLEADO { userName = user.getUserNameAndLast() };
            var data = await EF.BuscarAsync(id);
            ViewBag.mensajebusqueda = data.mensaje;
            if (data.mensaje == "nuevo")
                return View(salida);
            else if (data.mensaje == "notfound")
                return NotFound();
            else if (data.mensaje == "ok")
                return View(data.objeto);
            else
                return View(salida);
        }
        [Authorize(Roles = ("ADMINISTRADOR, SALIDA TRANSFERENCIA"))]
        public IActionResult Imprimir(string id)
        {
            var data = DAO.getTablaGuiasSalidaImpresion(id);
            datosinicio();
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,SALIDA TRANSFERENCIA"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(ASalidaTransferencia obj)
        {
            obj.estado = "HABILITADO";
            obj.idempresa = user.getIdEmpresaCookie();
            obj.idsucursal = user.getIdSucursalCookie();
            obj.fechatraslado = DateTime.Now;
            obj.usuariocrea = user.getIdUserSession();
            obj.fechacreacion = DateTime.Now;
            obj.usuariomodifica = user.getIdUserSession();
            obj.fechaedicion = DateTime.Now;

            var detalle = JsonConvert.DeserializeObject<List<ASalidaTransferenciaDetalle>>(obj.jsondetalle);
            detalle.ForEach(x => x.usuariocrea = obj.usuariocrea);
            detalle.ForEach(x => x.usuariomodifica = obj.usuariomodifica);
            obj.jsondetalle = JsonConvert.SerializeObject(detalle);
            var numelementos = detalle.Count;

            //var data = await EF.RegistrarAsync(obj);
            var data = await DAO.sp_registrarSalidaTransferencia(obj, numelementos);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR,MANTENIMIENTO GUIA"))]
        public async Task<IActionResult> Anular(int? id)
        {
            return Json(await DAO.sp_anularSalidaTransferencia(id));
            //return Json(await EF.AnularAsync(id));
        }
        public async Task<IActionResult> ListarSalidaTransferencia(string codigo, string idsucursalorigen, 
            string idsucursaldestino, string fechainicio, string fechafin, string estadoguia,int top)
        {
            return Json(await DAO.GetListaSalidaTransferencia(codigo, idsucursalorigen, idsucursaldestino, fechainicio,
                fechafin, estadoguia,top));
        }
        public async Task<IActionResult> ListarSalidaTransferenciaPorCargar(string codigo, string idsucursalorigen, string idsucursaldestino, string estadoguia)
        {
            return Json(await DAO.GetSalidaTransferenciaPorCargar(codigo, idsucursalorigen, idsucursaldestino, estadoguia));
        }
        public async Task<IActionResult> GetSalidaTransferenciaCompleta(string id)
        {
            return Json(await DAO.getSalidaTransferenciaCompleta(id));
        }

        [Authorize(Roles = ("ADMINISTRADOR, SALIDA TRANSFERENCIA"))]
        public IActionResult ImprimirTransferencia(string id)
        {
            
            var data = DAO.getSalidaTransferenciaImpresion(id);
            DataTable cab = new DataTable();

            cab = (DataTable)JsonConvert.DeserializeObject(data.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
            datosinicio();
            string serie=cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(0,4);
            string correlativo= cab.Rows[0]["NUMDOC"].ToString().Trim().Substring(4, 8);
            string ruc = cab.Rows[0]["RUCSALIDA"].ToString().Trim();
            string tpguia= cab.Rows[0]["TIPOGUIADOC"].ToString().Trim();
            string qr=AMantenimientoGuiaController.returnQRGuia(ruc, tpguia, serie, correlativo);

            DataColumn column = new DataColumn("QR", typeof(string));
            QR obj = new QR();
            obj.qr = qr;
            column.DefaultValue ="["+JsonConvert.SerializeObject(obj)+"]";
            data.Columns.Add(column);
           
            
            return View(data);
        }
        public class QR {
            public string qr{get;set;}
        }

        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.sucursales = modelo.sucursal;
            ViewBag.movimiento = modelo.movimiento;
        }
    }
}
