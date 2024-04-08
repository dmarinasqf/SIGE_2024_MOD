using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ERP.Controllers;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class DocumentoPersonalController : _baseController
    {
        private readonly Modelo db;     
        public DocumentoPersonalController(Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;          
        }
        public IActionResult Listar()
        {
            var query = (from DP in db.DOCUMENTOPERSONAL
                         where DP.estado == "HABILITADO" orderby DP.descripcion
                         select new
                         {
                             iddocumento = DP.iddocumento,
                             descripcion = DP.descripcion,
                             codigosunat = DP.codigosunat,
                             DP.longitud
                         }).ToList();
            return Json(query);
        }
    }
}
