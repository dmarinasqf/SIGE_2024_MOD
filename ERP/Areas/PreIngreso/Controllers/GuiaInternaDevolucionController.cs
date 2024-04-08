using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using ERP.Models.Ayudas;
using Newtonsoft.Json;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using ENTIDADES.preingreso;

namespace ERP.Areas.PreIngreso.Controllers
{
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class GuiaInternaDevolucionController : _baseController
    {
        private readonly Modelo db;
        private readonly GuiaDevolucionDAO dao;
        private readonly IGuiaDevolucionEF EF;
        public GuiaInternaDevolucionController(IGuiaDevolucionEF EF_, Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = EF_;
            LeerJson settings = new LeerJson();
            dao = new GuiaDevolucionDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, GUIA INTERNA DEVOLUCION")]

        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult GetGuiaCompleta(string tipo, int idtabla)
        {
            var data = dao.GetGuiaCompleta(tipo, idtabla);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult VerificarFacturaCantDevuelta(string tipo, int idtabla)
        {
            if (tipo == "factura")
            {
                var aux = db.PIPREINGRESODETALLE.Where(x => x.idfactura == idtabla && x.cantdevuelta > 0).ToList().Count();
                if (aux > 0)
                {
                    var data = dao.GetGuiaCompleta(tipo, idtabla);
                    return Json(new { mensaje = "ok", tabla = JsonConvert.SerializeObject(data) });
                }
                else
                {
                    return Json(new { mensaje = "No existe cantidades devueltas en el preingreso para grabar una guia de devolución" });

                }
            }
            else
            {
                var data = dao.GetGuiaCompleta(tipo, idtabla);
                return Json(new { mensaje = "ok", tabla = JsonConvert.SerializeObject(data) });
            }
        }
        [Authorize(Roles = "ADMINISTRADOR, GUIA INTERNA DEVOLUCION")]

        public async Task<IActionResult> RegistrarEditar(PIGuiaDevolucion obj)
        {
            obj.idsucursal = getIdSucursal();
            obj.idempresa = getEmpresa();
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        public IActionResult GetHistorialGuias(string idsucursal, string ordencompra, string preingreso, string factura, string guia, string fechainicio, string fechafin,int top)
        {
            if (idsucursal is "" || idsucursal is null)
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS ORDENES COMPRA"))
                    idsucursal = "";
                else
                    idsucursal = getIdSucursal().ToString();
            var data = dao.HistorialGuias(idsucursal, ordencompra, preingreso, factura, guia, fechainicio, fechafin,top);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult Imprimir(string id)
        {
            try
            {
                datosinicio();
                var data = dao.getTablaDevolucionImpresion(id);
                return View(data);
                //return View();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        public IActionResult Imprimir_V2(string id) {
            try {
                datosinicio();
                var data = dao.getTablaDevolucionImpresionV2(id);
                return View("Imprimir",data);
                //return View();
            }
            catch (Exception e) {
                return BadRequest(e);
            }
        }
        //getTablaDevolucionImpresionV2

        public IActionResult GetMotivoDevolucion()
        {
            var data = dao.GetMotivoDevolucion();
            return Json(JsonConvert.SerializeObject(data));
        }
    }
}