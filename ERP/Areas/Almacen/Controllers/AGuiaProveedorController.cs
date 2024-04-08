using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AGuiaProveedorController : _baseController
    {
        private readonly IGuiaSalidaEF EFGS;
        //private readonly IGuiaProveedorEF EF;
        //private readonly GuiaProveedorDAO DAO;
        private readonly IUser user;

        public AGuiaProveedorController(/*IGuiaProveedorEF context, */IGuiaSalidaEF context, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EFGS = context;
            //LeerJson settings = new LeerJson();
            //DAO = new GuiaSalidaDAO(settings.GetConnectionString());
            user = _user;
        }

        public async Task<IActionResult> Index()
        {
            datosinicio();
            await datosinicioAsync();
            return View();
        }













        private async Task datosinicioAsync()
        {
            var modelo = await EFGS.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.subclases = modelo.subclase;
            ViewBag.sucursales = modelo.sucursal;
        }
    }
}
