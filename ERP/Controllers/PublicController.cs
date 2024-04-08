using Erp.Infraestructura.Areas.Administrador.empleado.query;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
namespace ERP.Controllers
{
    [AllowAnonymous]
    public class PublicController : Controller
    {
        private readonly ISucursalEF sucursalef;
        private readonly IMediator mediator;
        protected IMediator _mediator => mediator ?? HttpContext.RequestServices.GetService<IMediator>();
        public PublicController(ISucursalEF sucursalef_)
        {
            sucursalef = sucursalef_;
        }
        [HttpPost]
        public IActionResult ListarSucursalxEmpresa(int idempresa,string tiposucursal)
        {
            var data = sucursalef.ListarSucursalxEmpresa(idempresa, tiposucursal);
            return Json(data);
        }
        [HttpPost]
        public async Task<IActionResult> GetDatosSucursalEmpresaxUserName(GetDatosSucursalEmpresaxUserName.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
    }
}
