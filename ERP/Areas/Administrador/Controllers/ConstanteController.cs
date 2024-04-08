using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERP.Controllers;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Administrador.DAO;
using Newtonsoft.Json;
using ERP.Models.Ayudas;

namespace ERP.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ConstanteController : _baseController
    {
        private readonly IConstanteEF EF;
        private readonly ConstanteDAO DAO;
        public ConstanteController(IConstanteEF context ,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new ConstanteDAO(settings.GetConnectionString());

        }
       
        [Authorize(Roles = ("ADMINISTRADOR, M_CONSTANTES"))]
        
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data = await EF.ListarAsync();
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_CONSTANTES"))]
        public async Task<IActionResult> Editar(Constante obj)
        {
            return Json(await EF.EditarAsync(obj));
        }


        // se usa para el listadode la tabla usando dao

        public async Task<IActionResult> listartablaconstante()
        {
            try
            {             
                    var detalle = DAO.getListaConstante();

                return Json(JsonConvert.SerializeObject(detalle));
            }
            catch (Exception e)
            {
                return Json(e.Message, null);
            }
        }


    }
}