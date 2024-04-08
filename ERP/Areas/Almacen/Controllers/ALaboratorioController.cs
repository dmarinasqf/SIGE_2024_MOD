using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;
using Erp.SeedWork;
using Microsoft.AspNetCore.Authorization;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;
using Erp.Infraestructura.Areas.Almacen.DAO;
using ERP.Models.Ayudas;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ALaboratorioController : _baseController
    {
        private readonly ILaboratorioEF EF;
        private readonly LaboratorioDAO DAO;

        public ALaboratorioController(ILaboratorioEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new LaboratorioDAO(settings.GetConnectionString());
        }      
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> RegistrarEditar(ALaboratorio obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        public async Task<IActionResult> ListarHabilitadosxDescripcion(string descripcion)
        {
            var data = await EF.ListarHabilitadasxDescripcionAsync(descripcion);
            return Json(new mensajeJson { mensaje = data.mensaje,tabla = data.tabla });
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> Eliminar(int? id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> Buscar(int id)
        {
            return Json(await EF.BuscarAsync(id));
        }
        public async Task<IActionResult> BuscarLaboratorios(string laboratorio)
        {
            return Json(await EF.BuscarLaboratorio(laboratorio));
        }
        public IActionResult BuscarLaboratoriosYCantidadDeCompras(string laboratorio)
        {
            var data = DAO.BuscarLaboratoriosYCantidadDeCompras(laboratorio);
            return Json(JsonConvert.SerializeObject(data));
            //return Json(await EF.BuscarLaboratoriosYCantidadDeCompras(laboratorio));
        }
        public IActionResult ListarLaboratoriosPorAlmacenSucursal(string idalmacensucursal)
        {
            var data = DAO.ListarLaboratoriosPorAlmacenSucursal(idalmacensucursal);
            return Json(JsonConvert.SerializeObject(data));
        }

        //REPRESENTANTE DE LABORATORIO   
        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> IndexRepresentante(int id)
        {
            datosinicio();
            var laboratorio = await EF.BuscarAsync(id);
          
            if (laboratorio is null)
                return NotFound();
            ViewBag.laboratorio = laboratorio.descripcion;
            ViewBag.idlaboratorio = laboratorio.idlaboratorio;
            var datos = await EF.ListarRepresentantexLaboratorioAsync(id);
            return View(datos);
        }


        [Authorize(Roles = ("ADMINISTRADOR,M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> RegistrarEditarRepresentante(CRepresentanteLaboratorio obj)
        {
            return Json(await EF.RegistrarEditarRepresentanteAsync(obj));

        }

        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> BuscarRepresentante(int? id)
        {
            return Json(await EF.BuscarRepresentanteAsync(id));
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_ALMACEN_LABORATORIO"))]
        public async Task<IActionResult> EliminarRepresentante(int? id)
        {
            return Json(await EF.EliminarRepresentanteAsync(id));
        }
        public async Task<IActionResult> representanteLaboratoriosProveedor(int proveedor)
        {
            return Json(await EF.representanteLaboratoriosProveedorAsync(proveedor));
        }
        public async Task<IActionResult> ListarLaboratorios()
        {
            return Json(await EF.ListarAsync());
        }

    }
}