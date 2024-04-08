using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Telemedico.Controllers {
    [Area("Telemedico")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class TelemedicoController : _baseController {
        private readonly IUser user;
        private readonly Modelo db;
        public TelemedicoController(Modelo _db, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager):base(cryptografhy,signInManager) 
        {
            LeerJson settings = new LeerJson();
            user = _user;
            db = _db;
        }
        public IActionResult Index() {
            datosinicio();
            return View();
        }
    }
}
