using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using ENTIDADES.Finanzas;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;

namespace ERP.Areas.Finanzas.Controllers
{
    [Area("Finanzas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class FDocumentoTributarioController : _baseController
    {
        private readonly Modelo db;
        private readonly IDocumentoTributarioEF EF;

        public FDocumentoTributarioController(IDocumentoTributarioEF _EF,Modelo context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = _EF;
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_DOCUMENTO_TRIBUTARIO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data = await db.FDOCUMENTOTRIBUTARIO.ToListAsync();
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_DOCUMENTO_TRIBUTARIO"))]
        public async Task<IActionResult> RegistrarEditar(FDocumentoTributario obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.FDOCUMENTOTRIBUTARIO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.iddocumento == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return Json(new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "DESHABILITADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return Json(new mensajeJson("ok", aux));
                        }
                        else
                            return Json(new mensajeJson("El registro ya existe", null));

                    }
                }
                else
                {
                    if (aux is null)
                    {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return Json(new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "DESHABILITADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return Json(new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.iddocumento == obj.iddocumento)
                        {
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return Json(new mensajeJson("ok", obj));
                        }
                        else
                            return Json(new mensajeJson("El registro ya existe", null));
                    }
                }
            }
            catch (Exception e)
            {
                return Json(new mensajeJson(e.Message, null));
            }
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_DOCUMENTO_TRIBUTARIO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            var obj = await db.FDOCUMENTOTRIBUTARIO.FirstOrDefaultAsync(m => m.iddocumento == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return Json(new mensajeJson("ok", obj));

        }
        [Authorize(Roles = ("ADMINISTRADOR, M_FINANZAS_DOCUMENTO_TRIBUTARIO"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            var obj = await db.FDOCUMENTOTRIBUTARIO.FirstOrDefaultAsync(m => m.iddocumento == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return Json(new mensajeJson("ok", obj));

        }

        public IActionResult BuscarDocumento(string id)
        {
            var data = db.FDOCUMENTOTRIBUTARIO.Find(id);
            return Json(data);
        }
        public IActionResult ListarDocumentos()
        {
            var data = db.FDOCUMENTOTRIBUTARIO.Where(x => x.estado == "HABILITADO").ToList();
            return Json(data);
        }
        public IActionResult ListarTipoDocumentoxDocumentoTributario(int iddocumento)
        {
           
            return Json(EF.ListarTipoDocumentoxDocumentoTributario(iddocumento));
        }
        public IActionResult ListarDocumentoSucursal(int idsucursal)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            return Json(EF.ListarDocumentosXSucursal(idsucursal));
        }
        public IActionResult ListarDocumentosxCajaSucursalParaVentas(int? idcajasucursal)
        {//para registrar ventas          
            return Json(EF.ListarDocumentosxCajaSucursalParaVentas(idcajasucursal));
        }
         public IActionResult ListarDocumentosxCajaAperturada(int idcajaaperturada)
        {   //para ver ventas        
            return Json(EF.ListarDocumentosxCajaAperturada(idcajaaperturada));
        }


    }
}