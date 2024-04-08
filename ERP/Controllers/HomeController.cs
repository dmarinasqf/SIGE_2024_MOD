using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ERP.Models;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using MimeKit;
using Wkhtmltopdf.NetCore;
using Rotativa.AspNetCore;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
namespace ERP.Controllers
{
    [Authorize]
    public class HomeController : _baseController
    {
        private readonly ILogger<HomeController> _logger;


       
        public HomeController(ILogger<HomeController> logger,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)        
            {
            _logger = logger;
         
        }

        public IActionResult Index()
        {
            datosinicio();            
            return View();
        }
       
       

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
      
    }
}
