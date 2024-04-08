using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Wordprocessing;
using ENTIDADES.Generales;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Administrador.DAO;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Areas.Administrador.Controllers
{
    [Area("Administrador")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CajaController : Controller
    {
        private readonly ICajaEF EF;
        private readonly CajaDAO DAO;
        public CajaController(ICajaEF _EF) 
        {
            EF = _EF;
            LeerJson settings = new LeerJson();
            DAO = new CajaDAO(settings.GetConnectionString());
        }
        public IActionResult ListarCajas()
        {
            return Json(EF.ListarCajas());
        }
        public IActionResult ListarCajasSucursal(int idsucursal)
        {
            return Json(EF.ListarCajasSucursal(idsucursal));
        }
        public IActionResult BuscarCajaSucursal(int idcajasucursal)
        {
            return Json(EF.BuscarCajaSucursal(idcajasucursal));
        }
        public async Task<IActionResult> ListarCorrelativosPorCaja(int idcajasucursal)
        {
            return Json(await EF.ListarCorrelativosPorCajaAsync(idcajasucursal));
        }
        public IActionResult RegistrarEditarCorrelativosPorCaja(CorrelativoDocumento obj)
        {
            return Json( EF.RegistrarEditarCorrelativosPorCaja(obj));
        }
        public IActionResult ActualizarDatosCaja(CajaSucursal obj)
        {
            return Json(EF.ActualizarDatosCaja(obj));
        }
        public async Task<IActionResult> ListarSerieCajasxsucursalxdocumento(string idsucursal, string nombredocumento)
        {
            return Json(await DAO.getSerieCajaxSucursal(idsucursal, nombredocumento));
        }
    }
}
