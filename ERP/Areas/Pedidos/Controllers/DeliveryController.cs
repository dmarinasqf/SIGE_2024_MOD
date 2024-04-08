using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Administrador.sucursal.query;
using Erp.Infraestructura.Areas.Pedido.DAO;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Gdp.Infraestructura.Delivery.Asignacion.command;
using Gdp.Infraestructura.Delivery.Asignacion.query;
using Gdp.Infraestructura.Delivery.query;
using Gdp.Infraestructura.Maestros.estadopedido;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class DeliveryController : _baseController
    {
        private readonly PedidoDAO DAO;
        public DeliveryController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new LeerJson();
            DAO = new PedidoDAO(settings.GetConnectionString());
        }

        public async Task<IActionResult> BuscarDatosDelivery(BuscarDatosDelivery.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL PEDIDO")]

        public async Task<IActionResult> AsignarPedidos()
        {
            datosinicio();
            if (User.IsInRole("JEFE_MOTORIZADO"))
            {
                var data = await _mediator.Send(new GetSucursalesEmpleado.Ejecutar { idempleado = getIdEmpleado() });
                ViewBag.sucursales = data;
            }
            else
            {
                var data = await _mediator.Send(new GetSucursalConLaboratorios.Ejecutar());
                ViewBag.sucursales = data;
            }
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL PEDIDO")]

        public async Task<IActionResult> ReporteAsignacion()
        {
            datosinicio();
            if (User.IsInRole("JEFE_MOTORIZADO"))
            {
                var data = await _mediator.Send( new GetSucursalesEmpleado.Ejecutar { idempleado = getIdEmpleado() });
                ViewBag.sucursales = data;
            }
            else
            {
                var data = await _mediator.Send(new GetSucursalConLaboratorios.Ejecutar ());
                ViewBag.sucursales = data;
            }
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL DELIVERY, LISTAR DELIVERY")]

        public IActionResult ListarDelivery()
        {
            //ViewBag.estadopedido = await _mediator.Send(new ListarEstado.Ejecutar { tipo = "pedido" });
            //ViewBag.estadodelivery = await _mediator.Send(new ListarEstado.Ejecutar { tipo = "delivery" });
            ViewBag.estadopedido = DAO.ListarEstado("pedido");
            ViewBag.estadodelivery = DAO.ListarEstado("delivery");
            datosinicio();
            return View();
        }
        public async Task<IActionResult> GetReporteAsignacion(ReporteAsignacion.EjecutarData data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> ListarPedidosAsignacion(ListarPedidosAsignacion.EjecutarData data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<FileResult> DescargarReporteAsignacion(ReporteAsignacion.EjecutarExcel data)
        {
            var file = await _mediator.Send(data);
            return File(file, "application/octet-stream", $"ReporteAsignacion{DateTime.Now.ToString("yyyyMMddhhmm")}.xlsx");
        }
        public async Task<IActionResult> CrearEntregaDelivery(CrearEntregaDelivery.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> EliminarEntregaDelivery(EliminarEntregaDelivery.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }


    }
}
