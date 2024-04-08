using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using ERP.Models.Ayudas;
using ENTIDADES.Generales;
using Erp.Persistencia.Servicios.Users;
using System.Collections.Generic;
using System;
using Newtonsoft.Json;
using INFRAESTRUCTURA.Areas.Almacen.DAO;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AConsumoEconomatoController : _baseController
    {
        private readonly IConsumoEconomatoEF EF;
        private readonly ConsumoEconomatoDAO DAO;
        private readonly IUser user;
        public AConsumoEconomatoController(IConsumoEconomatoEF EF_, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = EF_;
            user = _user;
            LeerJson settings = new LeerJson();
            DAO = new ConsumoEconomatoDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        public IActionResult Registrar()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, CONSUMO ECONOMATO")]
        [HttpPost]
        public async Task<IActionResult> Registrar(AConsumoEconomato oConsumoEconomato)
        {
            return Json(await EF.RegistrarConsumoEconomatoAsync(oConsumoEconomato));
        }
        public IActionResult ListarConsumoEconomato(string numdocumento, DateTime fechainicio, DateTime fechafin, int top)
        {
            var data = DAO.ListarConsumoEconomato(numdocumento, user.getIdSucursalCookie(),fechainicio, fechafin, top);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult BuscarUltimos10ConsumoEconomato(int idproducto)
        {
            try
            {
                var data = DAO.BuscarUltimos10ConsumoEconomato(idproducto);
                return Json(JsonConvert.SerializeObject(data));
            }
            catch (Exception x)
            {
                return Json(x.Message);
            }
        }
    }
}
