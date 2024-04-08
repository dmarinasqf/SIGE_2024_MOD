using Erp.Persistencia.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Veterinaria.Controllers
{
    [Authorize]
    [Area("Veterinaria")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class MaestroController : Controller
    {
        private readonly Modelo db;
        public MaestroController(Modelo _db)
        {
            db = _db;
        }
        public IActionResult ListarTipoMascota()
        {
            return Json(db.TIPOMASCOTA.Where(x => x.estado == "HABILITADO").ToList());
        } public IActionResult ListarRazaByTipoMascota(int idtipomascota)
        {
            return Json(db.RAZAMASCOTA.Where(X => X.estado == "HABILITADO" && X.idtipomascota == idtipomascota).ToList());
        }
        public IActionResult ListarPatologia()
        {
            return Json(db.PATOLOGIAMASCOTA.Where(X => X.estado == "HABILITADO").ToList());
        }
    }
}
