using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Maestros.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class TipoClienteController : _baseController
    {
        private readonly Modelo db;
        private readonly TipoClienteDAO DAO;
        private readonly IWebHostEnvironment ruta;

        public TipoClienteController(IWebHostEnvironment ruta_, Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            LeerJson settings = new LeerJson();
            DAO = new TipoClienteDAO(settings.GetConnectionString());
            ruta = ruta_;
        }

        public IActionResult ListarTipoCliente(string descripcion)
        {
            var data = DAO.ListarTipoCliente(descripcion);
            return Json(JsonConvert.SerializeObject(data));
        }
    }
}
