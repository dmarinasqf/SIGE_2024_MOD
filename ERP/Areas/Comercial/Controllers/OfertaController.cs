using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.comercial;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Comercial.DAO;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class OfertaController : _baseController
    {
       
        private readonly Modelo db;
        private readonly IOfertaEF EF;
        private readonly OfertaDAO DAO;
        
        public OfertaController(IOfertaEF _EF,Modelo db_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
        
            db = db_;
            EF = _EF;
            LeerJson settings = new LeerJson();
            DAO = new OfertaDAO(settings.GetConnectionString());
       
        }
        [Authorize(Roles = "CREAR BONIFICACION CLIENTE, ADMINISTRADOR")]
        public IActionResult BonificacionCliente()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "CREAR BONIFICACION CLIENTE, ADMINISTRADOR")]
        public IActionResult OfertaSucursal()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> RegistrarEditar(Oferta oferta)
        {
            return Json( await EF.RegistrarEditarAsync(oferta));
        }
        public IActionResult ListarOfertaSucursal(int idoferta)
        {
            return Json(EF.ListarOfertaSucursal(idoferta));
        }
        public IActionResult AsignarOfertaSucursal(int idoferta, int idsucursal)
        {
            return Json(EF.AsignarOfertaSucursal(idoferta, idsucursal));
        }
        public IActionResult AsignarOfertaSucursalEnBloque(int idoferta, List<string> idsucursal)
        {
            return Json(EF.AsignarOfertaSucursalEnBloque(idoferta, idsucursal));
        }
        public  IActionResult BuscarObsequios(string filtro, int top)
        {
            return Json(  EF.BuscarObsequios(filtro,top));
        } 
        public  IActionResult BuscarOfertaCompleta(int id)
        {
            var existe = db.OFERTA.Find(id);
            if (existe is null)
                return Json(null);
            var data = DAO.BuscarOfertaCompleta(id);
            return Json( JsonConvert.SerializeObject(data));
        }
    }
}
