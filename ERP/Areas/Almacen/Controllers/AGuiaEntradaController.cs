using System;
using System.Linq;
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
using Erp.SeedWork;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")] 
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AGuiaEntradaController : _baseController
    {
        private readonly IGuiaEntradaEF EF;
        private readonly GuiaEntradaDAO DAO;
        private readonly IUser user;
        public AGuiaEntradaController(IGuiaEntradaEF context, IUser _user, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            user = _user;
            LeerJson settings = new LeerJson();
            DAO = new GuiaEntradaDAO(settings.GetConnectionString()); ;
        }
       
        [Authorize (Roles =("ADMINISTRADOR,INGRESO GUIA DISTRIBUCION"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            await datosinicioViewBagAsync();
            //var data= await EF.ListarAsync();
            return View();
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, INGRESO GUIA DISTRIBUCION"))]
        public async Task<IActionResult> Registrar(int? id)
        {
            datosinicio();
            await datosinicioViewBagAsync();
            var data = await EF.BuscarAsync(id);
            AGuiaEntrada guia = new AGuiaEntrada();
            guia.idguiaentrada = 0;
            guia.empresa = new Empresa { descripcion = Request.Cookies["EMPRESA"].ToString() };
            guia.sucursal = new SUCURSAL { descripcion = Request.Cookies["SUCURSAL"].ToString() };
            guia.empleado = new EMPLEADO { userName = user.getUserNameAndLast() };
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
        [Authorize(Roles = ("ADMINISTRADOR,INGRESO GUIA DISTRIBUCION"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AGuiaEntrada obj)
        {   
            return Json(await EF.RegistrarEditarAsync(obj));
        }

        public async Task<IActionResult> GetListaGuiasEntrada(string codigo, string idsucursalenvia, string idsucursalrecepciona, string fechainicio,string fechafin, string estado,int top)
        {
            return Json(await DAO.getListaGuiaEntrada(codigo, idsucursalenvia, idsucursalrecepciona, fechainicio,fechafin,estado,top));
        }
        public async Task<IActionResult> GetGuiaEntradaCompleta(string id)
        {
            return Json(await DAO.GetGuiaEntradaCompleta(id));
        }
        private async Task datosinicioViewBagAsync()
        {
            var modelo = await EF.datosinicioViewBagAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.sucursales = modelo.sucursal;             
        }
    }
}
