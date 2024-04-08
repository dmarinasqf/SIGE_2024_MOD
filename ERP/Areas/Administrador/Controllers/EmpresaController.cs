using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ENTIDADES.compras;
using ERP.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Erp.Persistencia.Modelos;
using ERP.Controllers;
using ENTIDADES.Generales;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;


namespace ERP.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class EmpresaController : _baseController
    {
        private readonly IEmpresaEF EF;
        private readonly IWebHostEnvironment ruta;


        public EmpresaController(IEmpresaEF context, IWebHostEnvironment _ruta, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            ruta = _ruta;
        }

        [Authorize(Roles = ("ADMINISTRADOR, M_EMPRESA"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data = await EF.ListarAsync();
            return View(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, M_EMPRESA"))]
        public async Task<IActionResult> RegistrarEditar(Empresa obj)
        {
            return Json(await EF.RegistrarEditarAsync(obj));
        }
        public async Task<IActionResult> Listar()
        {
            return Json(await EF.ListarAsync());
        }

        public IActionResult guardarImagen(IFormFile[] file, string[] tipo, int id)
        {
            string path = ruta.WebRootPath;
            return Json(EF.guardarImagen(file, tipo, id, path));
        }
        public IActionResult BuscarEmpresa(int id)
        {

            return Json(EF.BuscarEmpresa(id));
        }

        // codigoguardar pdf drive

       



       
    }
}


