using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CorrelativoDocumentoController : _baseController
    {
        private readonly ICorrelativoDocumentoEF EF;
        private readonly ISucursalEF sucursalEF;
        private readonly IDocumentoTributarioEF documentoTributarioEF;

        public CorrelativoDocumentoController(ICorrelativoDocumentoEF context, ISucursalEF _sucu, IDocumentoTributarioEF _documento, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            sucursalEF = _sucu;
            documentoTributarioEF = _documento;
        }

        public async Task<IActionResult> ListarCorrelativosPorCaja(int idcajasucursal)
        {
            return Json(await EF.ListarCorrelativosPorCajaAsync(idcajasucursal));
        }


        //[Authorize(Roles = ("ADMINISTRADOR, M_CORRELATIVO_DOCUMENTO"))]
        //public async Task<IActionResult> Index(int codigo)
        //{
        //    datosinicio();
        //    var sucursal = sucursalEF.Buscar(codigo);
        //    var documentos = await documentoTributarioEF.ListarHabilitadosAsync();
        //    ViewBag.sucursales = sucursal;
        //    ViewBag.documentos = documentos;           
        //    var data = await EF.ListarAsync(codigo);
        //    return View(data);
        //}
        //[Authorize(Roles = ("ADMINISTRADOR, M_DOCUMENTO_TRIBUTARIO"))]
        //public async Task<IActionResult> RegistrarEditar(FCorrelativoDocumentoSucursal obj)
        //{
        //    return Json(await EF.RegistrarEditarAsync(obj));
        //}

        //[Authorize(Roles = ("ADMINISTRADOR, M_CORRELATIVO_DOCUMENTO"))]
        //public async Task<IActionResult> Eliminar(int? id)
        //{
        //    return Json(await EF.EliminarAsync(id));
        //}
        // public async Task<IActionResult> Buscar(int id)
        //{
        //    return Json(await EF.BuscarAsync(id));
        //}

        //[Authorize(Roles = ("ADMINISTRADOR, M_CORRELATIVO_DOCUMENTO"))]
        //public async Task<IActionResult> Habilitar(int? id)
        //{
        //    return Json(await EF.HabilitarAsync(id));
        //}

        //public IActionResult BuscarDocumento(string id)
        //{
        //    return Json( EF.BuscarDocumento(id));
        //}
        //public async Task<IActionResult> BuscarDocumentoyCorrelativo(FCorrelativoDocumentoSucursal obj)
        //{
        //    return Json(await EF.BuscarDocumentoyCorrelativoAsync(obj));
        //}



    }
}