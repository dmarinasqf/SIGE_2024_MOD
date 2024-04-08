using ENTIDADES.Almacen;
using ERP.Controllers;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class RegistroSanitarioController : _baseController
    {
        private readonly IRegistroSanitarioEF EF;
        public RegistroSanitarioController(IRegistroSanitarioEF context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
        }
        public IActionResult RegistrarEditar(ARegistroSanitario obj)
        {
            return Json(EF.RegistrarEditar(obj));
        } public IActionResult ListarxProducto(int idproducto)
        {
            return Json(EF.ListarxProducto(idproducto));
        }
        public IActionResult Buscar(int id)
        {
            return Json(EF.Buscar(id));
        }

    }
}
