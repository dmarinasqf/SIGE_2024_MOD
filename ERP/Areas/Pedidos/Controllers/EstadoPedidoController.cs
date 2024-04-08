using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Pedido.DAO;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
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
    public class EstadoPedidoController : _baseController
    {
        private readonly PedidoDAO DAO;
        public EstadoPedidoController(ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new LeerJson();
            DAO = new PedidoDAO(settings.GetConnectionString());
        }
        public IActionResult ListarEstadoPedido()
        {
            return Json(DAO.ListarEstado("pedido"));
        }
    }
}
