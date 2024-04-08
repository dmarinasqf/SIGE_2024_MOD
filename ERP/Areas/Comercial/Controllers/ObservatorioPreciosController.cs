using ENTIDADES.Almacen;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ObservatorioPreciosController : _baseController
    {
        private readonly Modelo db;
        private readonly IObservatorioPreciosEF EF;
        private readonly ProductoDigemidDAO DAO;
        public ObservatorioPreciosController(IObservatorioPreciosEF _EF,Modelo db_, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = _EF;
            db = db_;
            LeerJson settings = new LeerJson();
            DAO = new ProductoDigemidDAO(settings.GetConnectionString());
        }
        public IActionResult ActualizarPrecios()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> ActualizarPreciosDigemid(string productos)
        {
            
            var data = JsonConvert.DeserializeObject<List<AProductoDigemid>>(productos);
            var aux = DAO.GuardarPreciosDigemid(data);
            return Json(await EF.ActualizarPreciosDigemidAsync(data));
        }
    }
}
