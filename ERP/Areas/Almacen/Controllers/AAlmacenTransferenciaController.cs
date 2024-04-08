using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Almacen;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AAlmacenTransferenciaController : _baseController
    {
        //private readonly Modelo db;
        private readonly IAlmacenTransferenciaEF EF;
        private readonly AlmacenTransferenciaDAO DAO;
        public AAlmacenTransferenciaController(Modelo context, IAlmacenTransferenciaEF _EF, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            //db = context;
            EF = _EF;
            LeerJson settings = new LeerJson();
            DAO = new AlmacenTransferenciaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR,ALMACENES TRANSFERENCIA"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
            //return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR,ALMACENES TRANSFERENCIA"))]
        public IActionResult RegistrarEditar(int? id)
        {
            datosinicio();
            if (id != null || id is not null)
            {
                AAlmacenTransferencia oAlmacenTransferencia = new AAlmacenTransferencia();
                oAlmacenTransferencia.idalmacentransferencia = Convert.ToInt32(id);
                return View(oAlmacenTransferencia);
            }
            else
                return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR,ALMACENES TRANSFERENCIA"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AAlmacenTransferencia oAlmacenTransferencia)
        {
            return Json(await EF.RegistrarEditarAsync(oAlmacenTransferencia));
        }

        public async Task<IActionResult> ListarAlmacenTransferencia(string numdocumento, int idalmacensucursalorigen, int idalmacensucursaldestino, string estado, string fechainicio, string fechafin)
        {
            return Json(await DAO.GetListaAlmacenTransferencia(numdocumento, idalmacensucursalorigen, idalmacensucursaldestino, estado, fechainicio, fechafin));
        }

        public async Task<IActionResult> BuscarStockLoteProductoPorAlmacenSucursal(int idalmacensucursal, string codigo, string nombre, string lote)
        {
            return Json(await DAO.GetStockLoteProductoPorAlmacenSucursal(idalmacensucursal, codigo, nombre, lote));
        }
        public async Task<IActionResult> BuscarAlmacenTransferenciaCompleto(int id)
        {
            return Json(await DAO.GetAlmacenTransferenciaCompleto(id));
        }
    }
}
