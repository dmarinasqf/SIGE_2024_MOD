using ENTIDADES.Almacen;
using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Almacen.DAO;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AProductoParecidoController : _baseController
    {
        private ProductoParecidoDAO dao;
        public AProductoParecidoController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new LeerJson();
            dao = new ProductoParecidoDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult Registrar(int? idproducto)
        {
            datosinicio();
            return View();
        }

        public IActionResult RegistrarProductoParecido(AProductoParecido oProductoparecido, string idproductosparecidos)
        {
            oProductoparecido.usuariocrea = getIdEmpleado().ToString();
            oProductoparecido.fechacreacion = DateTime.Now;
            oProductoparecido.usuariomodifica = getIdEmpleado().ToString();
            oProductoparecido.fechaedicion = DateTime.Now;
            oProductoparecido.estado = "HABILITADO";
            var result = dao.RegistrarEditarProductoParecido(oProductoparecido, idproductosparecidos);
            return Json(JsonConvert.SerializeObject(result));
        }
        public IActionResult ListarProductosAgrupados(string codigoproducto, string nombreproducto)
        {
            var result = dao.ListarProductosAgrupados(codigoproducto, nombreproducto);
            return Json(JsonConvert.SerializeObject(result));
        }

        [HttpPost]
        public IActionResult ListarProductosParecidos(int idproducto)
        {
            var result = dao.ListarProductosParecidos(idproducto);
            return Json(JsonConvert.SerializeObject(result));
        }
    }
}
