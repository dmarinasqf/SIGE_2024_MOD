
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using ENTIDADES.Generales;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.Administrador.DAO;
using ERP.Models.Ayudas;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Erp.Infraestructura.Areas.Administrador.empleado.query;
using Erp.Infraestructura.Areas.Administrador.empleado.command;
using Gdp.Infraestructura.Asistencia.control.query;
using Gdp.Infraestructura.Asistencia.control.command;
using System;

namespace ERP.Areas.Administrador.Controllers
{
    [Authorize]
    [Area("Administrador")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class EmpleadoController : _baseController
    {
        private readonly IEmpleadoEF EF;
        private readonly EmpleadoDAO DAO;
        private readonly IWebHostEnvironment ruta;
        public EmpleadoController(IWebHostEnvironment ruta_,IEmpleadoEF context, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson json = new LeerJson();
            ruta = ruta_;
            DAO = new EmpleadoDAO(json.GetConnectionString());
         
        }
        
        [Authorize(Roles = "ADMINISTRADOR, M_EMPLEADO")]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var model = await EF.ListarModelAsync();
           
            ViewBag.sucursales = model.sucursales;
            ViewBag.grupos = model.grupos;
            ViewBag.canalventas = model.canalventas;
            ViewBag.cargoempleado = model.cargoempleado;
            return View();
            
        }
        [Authorize(Roles = "ADMINISTRADOR, M_PERMISOS")]
        public async Task<IActionResult> Permisos(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            datosinicio();            
            var empleado =  EF.getEmpleado(id);
            var areas = await EF.permisosEmpleadoAsync(id.ToString());
            EmpleadoPermisoModel data = new EmpleadoPermisoModel();
            data.empleado = empleado;
            data.areas =  areas;
            if (empleado == null)
            {
                return NotFound();
            }	//47404829

            return View(data);
        }
        [Authorize(Roles = "ADMINISTRADOR, M_PERMISOS")]
        public async Task<IActionResult> AgregarRemoverPermiso(int empleado,string permiso)
        {          
         
                return Json(await EF.AgregarRemoverPermisoAsync(empleado,permiso));
            
        }
        [Authorize(Roles = "ADMINISTRADOR, M_EMPLEADO")]
        public async Task<IActionResult> Crear(EMPLEADO obj)
        {
            return Json(await EF.CrearAsync(obj));

        }
        [Authorize(Roles = "ADMINISTRADOR, M_EMPLEADO")]
        public async Task<IActionResult> Detalle(int id)
        {
            return Json(await EF.DetalleAsync(id));
        }
        [Authorize(Roles = "ADMINISTRADOR, M_EMPLEADO")]
        public async Task<IActionResult> Eliminar(int id)
        {
            return Json(await EF.EliminarAsync(id));
        }
        public async Task<IActionResult> Editar(EMPLEADO obj)
        {
            return Json(await EF.EditarAsync(obj));
        }  
        [HttpPost]
        public IActionResult ListarEmpleados()
        {
            return Json( JsonConvert.SerializeObject( DAO.ListarEmpleados()));
        }
        public IActionResult BuscarEmpleados(string filtro, int top, string sucursal)
        {
            return Json( JsonConvert.SerializeObject( DAO.BuscarEmpleados(filtro,top,sucursal)));
        }
        public async Task<IActionResult> ListarRolesEmpleado(int idempleado)
        {
            return Json(await EF.ListarRolesEmpleadoSinAreaAsync(idempleado));
        }
        public IActionResult GuardarFoto(IFormFile file, int id)
        {
            var path = ruta.WebRootPath + "/imagenes/empleados/";
            return Json(EF.GuardarImagen(file, id, path));
        }
        public async Task<IActionResult> ValidarCredenciales(ValidarCredenciales.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarEmpleadosDatosBasicos(ListarEmpleadosDatosBasicos.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AsignarCanalVenta(AsignarCanalVenta.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AsignarSucursal(AsignarSucursal.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarEmpleadosxCargo(ListarEmpleadosxCargo.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarEmpleadosA(GetListarEmpleadosA.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListaEmpleadosNA(GetListaEmpleadosNA.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EliminarEmpleadoA(EliminarEmpleadosAutoridad.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarMotorizados(ListarMotorizados.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
         // CODIGO PARA EL LISTADO DE ALMACENES
        public IActionResult listaralmacenempelado(int idsucursal, int idempleado)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            var data = DAO.Listaralmacenempleado(idsucursal, idempleado);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult guardaralmacenempelado(int idalmacensucursal,int idsucursal, int idempleado,int idempleadocreaedi, int estado)
        {
            if (idempleadocreaedi is 0)
                idempleadocreaedi = getIdEmpleado();

            try
            {
                var data = DAO.guardaralmacenempelado( idalmacensucursal,  idsucursal,  idempleado,  idempleadocreaedi,estado);
                return Json(new { mensaje = data });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return Json(new { mensaje = "Error en el servidor" });
            }
        }
    }
}
