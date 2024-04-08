using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;

namespace ERP.Areas.Compras.Controllers
{
    [Area("Compras")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CProveedorLaboratorioController : _baseController
    {
        private readonly Modelo db;
        private readonly IProveedorLaboratorioEF EF;
        private readonly ProveedorLaboratorioDAO DAO;
        public CProveedorLaboratorioController(Modelo context, IProveedorLaboratorioEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = _EF;
            LeerJson settings = new LeerJson();
            DAO = new ProveedorLaboratorioDAO(settings.GetConnectionString());
        }
     
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public async Task<IActionResult> Index(int id)
        {
            datosinicio();
            var proveedor = await db.CPROVEEDOR.FindAsync(id);
            return View(proveedor);
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public async Task<IActionResult> RegistrarEliminar(CProveedorLaboratorio obj)
        {
            return Json(await EF.RegistrarEliminarAsync(obj));

        }     
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public IActionResult listarLaboratorios(string idproveedor)
        {
         
            var data = DAO.getLaboratorios(idproveedor);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public async Task<IActionResult> ListarLaboratorioxProveedor(string idproveedor,string laboratorio)
        {         
            var data = await DAO.getLaboratoriosXProveedorAsync(idproveedor, laboratorio);
            return Json(new { mensaje =data.mensaje,tabla=JsonConvert.SerializeObject(data.tabla)});
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_COMPRAS_PROVEEDORLABORATORIO"))]
        public IActionResult BuscarLaboratoriosxProveedor(string idproveedor)
        {            
            var data = DAO.getLaboratoriosxProveedor(idproveedor);
            return Json(data);
        }

    }

}