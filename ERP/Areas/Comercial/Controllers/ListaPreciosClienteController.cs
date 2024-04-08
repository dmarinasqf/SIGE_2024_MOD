using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.command;
using Erp.Infraestructura.Areas.Comercial.listaprecios.precioscliente.query;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Comercial.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ListaPreciosClienteController : _baseController
    {
       
        private readonly IWebHostEnvironment ruta;
        private readonly ListaPreciosDAO DAO;
        public ListaPreciosClienteController(IWebHostEnvironment _ruta, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {          
            ruta = _ruta;
            LeerJson settings = new LeerJson();
            DAO = new ListaPreciosDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR, LISTA DE PRECIOS CLIENTE"))]

        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public async Task<IActionResult> CrearListaCliente(CrearListaCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarListaCliente(BuscarListaCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarPreciosClienteBloque(RegistrarPreciosCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EliminarPreciosCliente(EliminarPreciosCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarProductosLista(BuscarProductosLista.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public IActionResult ListarPreciosCliente(string codigo) {
            var data = DAO.ListarPreciosCliente(codigo);
            return Json(JsonConvert.SerializeObject(data));
        }

    }
}
