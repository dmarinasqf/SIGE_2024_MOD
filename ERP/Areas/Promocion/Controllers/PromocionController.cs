using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Promocion.Dao;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Promocion.Controllers
{
    [Area("Promocion")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PromocionController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly PromocionDao DAO;
            
        public PromocionController(IWebHostEnvironment _webHostEnvironment, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = _webHostEnvironment;
            LeerJson settings = new LeerJson();
            DAO = new PromocionDao(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
