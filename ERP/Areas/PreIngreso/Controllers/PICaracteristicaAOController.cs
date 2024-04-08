﻿using ENTIDADES.preingreso;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Erp.Persistencia.Servicios;
using ENTIDADES.Identity;

namespace ERP.Areas.PreIngreso.Controllers
{
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PICaracteristicaAOController : _baseController   
    {
        private readonly ICaracteristicaAOEF EF;        
        public PICaracteristicaAOController(ICaracteristicaAOEF _EF, ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = _EF;
        }
        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO CARACTERISTICAAO"))]
        public async Task<IActionResult> Index()
        {
            datosinicio();
            var data = await EF.ListarAsync("","");
            return View(data);
        }

        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO CARACTERISTICAAO"))]
        public async Task<IActionResult> RegistrarEditar(PICaracteristicaAO obj)
        {
            var data = await EF.RegistrarEditarAsync(obj);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO CARACTERISTICAAO"))]
        public async Task<IActionResult> Deshabilitar(int? id)
        {
            var data = await EF.DeshabilitarAsync(id);
            return Json(data);
        }
        [Authorize(Roles = ("ADMINISTRADOR, PREINGRESO CARACTERISTICAAO"))]
        public async Task<IActionResult> Habilitar(int? id)
        {
            var data = await EF.HabilitarAsync(id);
            return Json(data);
        }

        public async Task<IActionResult> Listar(string estado, string idcategoria)
        {
            return Json(await EF.ListarAsync(estado,idcategoria));
        }
       
        public async Task<IActionResult> Buscar(int id)
        {
            var data = await EF.BuscarAsync(id);
            return Json(data);
        }
    }
}