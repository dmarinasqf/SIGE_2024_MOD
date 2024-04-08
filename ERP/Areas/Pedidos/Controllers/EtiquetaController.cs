using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Pedidos.Etiquetas.command;
using Gdp.Infraestructura.Pedidos.Etiquetas.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Erp.Areas.Pedidos.Controller
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class EtiquetaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;

        public EtiquetaController(IWebHostEnvironment _webHostEnvironment, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = _webHostEnvironment;
        }

        public async Task<IActionResult> getDatosEtiquetas(DatosEtiquetas.Ejecutar obj) 
        {
            var cabecera = await _mediator.Send(obj);
            var command = new DetallePedidoCommand.Ejecutar { idpedido = obj.idpedido };
            var detalle = await _mediator.Send(command);


            return Json(new { datatable = cabecera, detalle = detalle });
        }

    }
}
