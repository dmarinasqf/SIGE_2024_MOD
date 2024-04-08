using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace ERP.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ConsultorioController : _baseController
    {
        public ConsultorioController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
        }

        public async Task<IActionResult> ListarConsultorioPorSucursal(ListarConsultorioPorSucursal.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));

        }
    }
}