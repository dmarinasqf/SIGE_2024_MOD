using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using ERP.Controllers;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.DAO;
using ERP.Models.Ayudas;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Administrador.sucursal.query;
using VisitadorMedico.Infraestructura.VisitaMedica.query;
using Erp.Persistencia.Servicios.Users;
using Newtonsoft.Json;

namespace ERP.Areas.Administrador.Controllers
{
    [Authorize]
    [Area("Administrador")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class SucursalController : _baseController
    {
        private readonly ISucursalEF EF;
        private readonly SucursalDAO DAO;
        //Se agrega clase user
        private readonly IUser user;
        public SucursalController(ISucursalEF context,IUser _user, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            //Se agrega clase user
            user = _user;
            DAO = new SucursalDAO(settings.GetConnectionString(),user);
        }
        [Authorize(Roles = "ADMINISTRADOR, M_SUCURSAL")]
        public async Task<ActionResult> Index()
        {
            datosinicio();
            var modelo = await EF.ListarModelAsync();
            ViewBag.Lugares = modelo.lugares;
            ViewBag.Empresas = modelo.empresas;
            ViewBag.Laboratorios = modelo.laboratorios;
            var sucursales = await DAO.listarSucursalesAsync("");
            return View(sucursales);
        }
        [Authorize(Roles = "ADMINISTRADOR, M_SUCURSAL")]
        public ActionResult Create(SUCURSAL sucursal)
        {
            return Json(EF.Create(sucursal));
        }
        [HttpPost]
        public ActionResult Buscar(int id)
        {
            return Json(EF.Buscar(id));
        }
        [Authorize(Roles = "ADMINISTRADOR, M_SUCURSAL")]
        [HttpPost]
        public ActionResult Edit(SUCURSAL sucursal)
        {
            return Json(EF.Edit(sucursal));

        }
        [Authorize(Roles = "ADMINISTRADOR, M_SUCURSAL")]
        [HttpPost]
        public ActionResult Delete(int id, string tipo)
        {
            return Json(EF.Delete(id, tipo));

        }
        public IActionResult ListarLaboratorioSucursal(int sucursal)
        {            
                return Json(EF.ListarLaboratorioSucursal(sucursal));            
        }
      
        public IActionResult ListarSucursalxEmpresa(int idempresa, string tiposucursal)
        {
            if (idempresa is 0)
                idempresa = getEmpresa();
            var data = EF.ListarSucursalxEmpresa(idempresa, tiposucursal);
            return Json(data);

        }
        public IActionResult ListarSucursalxEmpresaQF(int idempresa, string tiposucursal)
        {
            if (idempresa is 0)
                idempresa = getEmpresa();
            return Json(EF.ListarSucursalxEmpresaQF(idempresa, tiposucursal));

        }
        public IActionResult AgregarEliminarLaboratorio(int idsucursal, int idlaboratorio)
        {
            return Json(EF.AgregarEliminarLaboratorio(idsucursal,idlaboratorio));
        }
        public IActionResult AgregarEliminarCaja(int idsucursal, int idcaja)
        {
            return Json(EF.AgregarEliminarCaja(idsucursal,idcaja));
        }
        public IActionResult AsignarListaPrecios(int idsucursal, int idlista)
        {
            return Json(EF.AsignarListaPrecios(idsucursal, idlista));
        }
        public IActionResult cargarProducion()
        {
            return Json(EF.cargarProducion());

        }
        public IActionResult ListarSucursalesPrimarias(int idempresa)
        {
            if (idempresa is 0)
                idempresa = getEmpresa();
            return Json(EF.ListarSucursalesPrimarias(idempresa));

        }
        public IActionResult ListarSucursales(string tipo)
        {     
            return Json(EF.ListarSucursales(tipo));
        }
        public IActionResult ListarSucursales2(string tipo)
        {

            return Json(EF.ListarSucursales2(tipo));

        }
        public IActionResult ListarSucursalDelivery()
        {
         
            return Json(EF.ListarSucursalDelivery());

        }
        public IActionResult ListarSucursalesByTipoLocal(string tipo)
        {
         
            return Json(EF.ListarSucursalesByTipoLocal(tipo));

        }
        public async Task<IActionResult> ListarEmpleadosSucursal(ListarEmpleadosSucursal.Ejecutar obj)
        {
            if (obj.idlaboratorio is 0)
                obj.idlaboratorio = getIdSucursal();
            return Json(await _mediator.Send(obj));

        }
        public async Task<IActionResult> getLaboratoriosParaRepMedico(ListarLaboratoriosParaRepMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> getLaboratoriosDeSupervisor(ListarLaboratorioDeSupervisor.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarSucursalEntrega()
        {
            var data = await _mediator.Send(new ListarSucursalEntrega.Ejecutar());
            return Json(data);
        }

        public IActionResult ListarLaboratorio()
        {
            return Json(EF.ListaLaboratorio());
        }
        public IActionResult ListarCorrelativos(string idsucursal) {
            if (idsucursal == "" || idsucursal is null) idsucursal = (getIdSucursal()).ToString();
            var data = DAO.getCorrelativo(idsucursal);
            //return Json(await EF.RegistrarSalidaAsync(salida));
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult ListarModalesActivos(string fecha,string ruta)
        {
            string idsucursal="";
            if (idsucursal == "" || idsucursal is null) idsucursal = (getIdSucursal()).ToString();
            var data = DAO.listarmodalesactivos(fecha,  ruta, idsucursal);
            //return Json(await EF.RegistrarSalidaAsync(salida));
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult ListarUsuarioActivadoModal(int idmodalpersonalizado)
        {
            string idempleado = "";
            if (idempleado == "" || idempleado is null) idempleado = (getIdEmpleado()).ToString();
            var data = DAO.listarUsuarioActivadoModal(idmodalpersonalizado, idempleado);
            //return Json(await EF.RegistrarSalidaAsync(salida));
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult GuardarEditarUsuarioActivadoModal(int idModalActivadoPorUsuario, int idmodalpersonalizado, string fechaactualpara, int tipo)
        {
            string idempleado = "";
            if (idempleado == "" || idempleado is null) idempleado = (getIdEmpleado()).ToString();
            var data = DAO.guardarEditarUsuarioActivadoModal(idModalActivadoPorUsuario,idmodalpersonalizado, idempleado, fechaactualpara,tipo);
            //return Json(await EF.RegistrarSalidaAsync(salida));
            return Json(JsonConvert.SerializeObject(data));
        }



    }

}