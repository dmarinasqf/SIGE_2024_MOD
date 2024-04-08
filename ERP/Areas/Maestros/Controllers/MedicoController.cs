using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Maestros.medico.mantenimiento;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Maestros.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using VisitadorMedico.Infraestructura.Maestros.Medico.command;
using VisitadorMedico.Infraestructura.Maestros.Medico.query;
using VisitadorMedico.Infraestructura.Maestros.MedicoBanco.command;
using VisitadorMedico.Infraestructura.Maestros.MedicoBanco.query;
using VisitadorMedico.Infraestructura.VisitaMedica.query;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class MedicoController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly Modelo db;
        private  readonly ClienteDAO DAO;

        public MedicoController(IWebHostEnvironment ruta_, Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            LeerJson settings = new LeerJson();
            DAO = new ClienteDAO(settings.GetConnectionString());
            ruta = ruta_;
        }

        [Authorize(Roles = "ADMINISTRADOR, MANTENEDOR_MEDICO")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult RegistrarEditar(int? id)
        {
            datosinicio();
            ViewBag.idmedico = id;
            try
            {
                if (id != null)
                {
                    var medico = db.MEDICO.Find(id.Value);
                    if (medico is null)
                        return NotFound();
                }
            }
            catch (Exception e)
            {
                
            }
            return View();
        }
        public async Task<IActionResult> BuscarMedicos(BuscarMedicos.Ejecutar obj)
        {
            var data= DAO.BuscarMedico(obj.colegio,obj.filtro,obj.top);
            return Json(await _mediator.Send(obj));
            //return Json(JsonConvert.SerializeObject(data));
        }
        //public async Task<IActionResult> BuscarMedicosPaginacion(BuscarMedicos.Ejecutar obj)
        //{
        //    return Json(await _mediator.Send(obj));
        //}
        public async Task<IActionResult> BuscarMedicoByNumColegio(BuscarMedicoByNumColegio.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> ListarMedicosByOReceta(ListarMedicosByOReceta.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> getListarMedicosxDisponibilidadH(ListarxMedicoPorDiponibilidadH.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> getListarMedicosAsociados(ListarxMedicoAsociados.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> SetMedico(RegistrarEditar.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> SetImagen(AgregarImagen.Ejecutar data)
        {
            data.ruta = ruta.WebRootPath;
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> getMedicoxId(ListarMedicoxId.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> setMedicobanco(AgregarBanco.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> getMedicobancoCodigo(ListarMedicobanco.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> deleteMedico(EliminarMedico.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GenerarExcelMedicos(string text) {
            var data = await DAO.GenerarExcelMedicos(ruta.WebRootPath);
            return Json(data);
        }
    }
}
