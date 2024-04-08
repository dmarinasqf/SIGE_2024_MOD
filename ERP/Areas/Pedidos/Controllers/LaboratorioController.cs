using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Pedido.DAO;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Gdp.Infraestructura.Maestros.dificultadformula.query;
using Gdp.Infraestructura.Maestros.estadopedido;
using Gdp.Infraestructura.Pedidos.listarpedidos.command;
using Gdp.Infraestructura.Pedidos.listarpedidos.query;
using Gdp.Infraestructura.Pedidos.registro.command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Pedidos.Controllers
{

    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class LaboratorioController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly PedidoDAO DAO;
        private readonly IUser user;
        public LaboratorioController(IWebHostEnvironment _webHostEnvironment, IUser user_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            user = user_;
            ruta = _webHostEnvironment;
            LeerJson settings = new LeerJson();
            DAO = new PedidoDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = "ADMINISTRADOR, LABORATORIO PEDIDO")]
         
        public IActionResult Laboratorio()
        {
            //ViewBag.estadopedido = await _mediator.Send(new ListarEstado.Ejecutar { tipo = "pedido" });
            ViewBag.estadopedido = DAO.ListarEstado("pedido");
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, LABORATORIO PEDIDO")]

        public async Task<IActionResult> ListarPedidosLaboratorio(ListarPedidos.Ejecutar obj)
        {
            if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                obj.laboratorio = getIdSucursal().ToString();           
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> TransferirPedido(int idpedido, int idempleado, string laboratorio)
        {
            var data = await DAO.TransferirPedido(idpedido, idempleado, laboratorio);
            return Json(data);
        }
        public IActionResult ListarDificultad(string estado)
        {
            var data = JsonConvert.SerializeObject(DAO.ListarDificultad(estado));
            return Json(data);
        }  public async Task<IActionResult> CambiarDificultadItem(int iddetalle, int iddificultad)
        {
            var data = await DAO.CambiarDificultadItem(iddetalle, iddificultad, this.user.getIdUserSession());
            return Json(data);
        }
        public async Task<IActionResult> IngresarOrdenProduccion(int idpedido, string orden)
        {
            int usuariolaboratorio = int.Parse(user.getIdUserSession());
            var data = await DAO.IngresarOrdenProduccion(idpedido, orden, usuariolaboratorio);
            return Json(data);
        }
        public async Task<IActionResult> IngresarNumDocumento(int idpedido, string numdocumento)
        {
            var data = await DAO.IngresarNumDocumento(idpedido, numdocumento);
            return Json(data);
        } 
        public async Task<IActionResult> TerminarPedido(int idpedido, int idformulador, string tipo)
        {
            int usuario = Convert.ToInt32(user.getIdUserSession());
            var data = await DAO.TerminarPedido(idpedido, idformulador, tipo, usuario);
            return Json(data);
        }
        public IActionResult BuscarPedidosDevueltos(string idlaboratorio)
        {
            idlaboratorio = getIdSucursal().ToString();
            ////return Json(await _mediator.Send(obj));
            var data = DAO.BuscarPedidosDevueltos(idlaboratorio);
            return Json(data);
            //obj.idlaboratorio = getIdSucursal().ToString();
            //return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> DescargarPedidoDevuelto(int idpedido, int idquimico)
        {
            var data = await DAO.DescargarPedidoDevuelto(idpedido, idquimico);
            return Json(data);
        }
        public async Task<IActionResult> CambiarFormuladorxItem(int iddetalle, int idformulador)
        {
            var data = await DAO.CambiarFormulador(iddetalle, idformulador);
            return Json(data);
        }
        public async Task<IActionResult> CambiarLaboratorioAsignado(int iddetalle, int idlaboratorio)
        {
            int usuario = Convert.ToInt32(user.getIdUserSession());
            var data = await DAO.CambiarLaboratorioAsignado(iddetalle, idlaboratorio, usuario);
            return Json(data);
        }
        public async Task<IActionResult> ListarDetallePorLaboratorioAsignado(ListarDetallePorLaboratorioAsignado.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ObtenerNumeroDetallePedidosAsignados(ObtenerNumeroDetallePedidosAsignados.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> CambiarEstadoProcesoDetalle(int iddetalle)
        {
            //return Json(await _mediator.Send(obj));
            int usuario = Convert.ToInt32(user.getIdUserSession());
            var data = await DAO.CambiarEstadoProcesoDetalle(iddetalle, usuario);
            return Json(data);
        }
        public async Task<IActionResult> ListarDetallePorLaboratorioRecepcionado(ListarDetallePorLaboratorioRecepcionado.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ObtenerNumeroDetallePedidosRecepcionados(ObtenerNumeroDetallePedidosRecepcionados.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AlertaDetalleSegunComplejidad(AlertaDetalleSegunComplejidad.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> CambiarEstadoDetalleTerminado(int iddetalle, bool estadoTerminado)
        {
            //return Json(await _mediator.Send(obj));
            int usuario = Convert.ToInt32(user.getIdUserSession());
            var data = await DAO.CambiarEstadoDetalleTerminado(iddetalle, Convert.ToInt32(estadoTerminado), usuario);
            return Json(data);
        }
        public async Task<IActionResult> ListarDificultadDetallePedido(ListarDificultadDetallePedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}