using ENTIDADES.preingreso;
using ERP.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using ERP.Models.Ayudas;
using DinkToPdf.Contracts;
using Erp.Persistencia.Servicios.Users;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using ENTIDADES.Identity;

namespace ERP.Areas.PreIngreso.Controllers
{
    [Area("PreIngreso")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PIAnalisisOrganolepticoController : _baseController   
    {
        //private readonly Modelo db;
        private readonly IAnalisisOrganolepticoEF EF;
        private readonly IUser user;
        private readonly IConverter pdf;
        private readonly AnalisisOrganolepticoDAO DAO;

        private int idquimico = 462;//EARTCOD1012//

        public PIAnalisisOrganolepticoController(IAnalisisOrganolepticoEF context, IUser _user,IConverter _pdf ,ICryptografhy cryptografhy,SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            user = _user;
            EF = context;
            pdf = _pdf;
            LeerJson settings = new LeerJson(); 
            DAO = new AnalisisOrganolepticoDAO(settings.GetConnectionString());
        }
       
        [Authorize(Roles = ("ADMINISTRADOR, ANALISIS ORGANOLEPTICO"))]
        public IActionResult Index()
        {
            datosinicio();            
            return View();
        }
        [Authorize(Roles = ("ADMINISTRADOR, ANALISIS ORGANOLEPTICO"))]
        public async Task<IActionResult> Registrar(int? id)
        {
            datosinicio();
            await datosinicioViewBagAsync();
            var data = await EF.BuscarAsync(id);          
            PIAnalisisOrganoleptico analisis = new PIAnalisisOrganoleptico();
            analisis.fecha = DateTime.Now;//EARTCOD1012//
            analisis.idanalisisorganoleptico = 0;
            analisis.empresa = new Empresa { descripcion = Request.Cookies["EMPRESA"].ToString() };
            analisis.sucursal = new SUCURSAL { descripcion = Request.Cookies["SUCURSAL"].ToString() };
            //analisis.quimico = new EMPLEADO { userName = user.getUserNameAndLast() };
            analisis.quimico = new EMPLEADO { userName = DAO.BuscarEmpleadoQuimico(idquimico) };//EARTCOD1012//
            ViewBag.mensajebusqueda = data.mensaje;
            if (data.mensaje == "nuevo")
                return View(analisis);
            else if (data.mensaje == "notfound")
                return NotFound();
            else if (data.mensaje == "ok")
            {
                return View(data.objeto);
            }
            else
                return View(analisis);

        }
        [Authorize(Roles = ("ADMINISTRADOR, ANALISIS ORGANOLEPTICO"))]
        [HttpPost]
        public async Task<IActionResult> Registrar(PIAnalisisOrganoleptico analisis)
        {
            //var dato = analisis;//EARTCOD1013
            analisis.idquimico = idquimico;//EARTCOD1013//
            return Json(await EF.RegistrarEditarAsync(analisis));
        }
        
        public IActionResult Imprimir(int id)
        {
            var data = DAO.getAnalisisOrganolepticoImprimir(id);
            return View(data);
        }
        public async Task<IActionResult> getListaAnalisisOrganoleptico(string codigo,string sucursal,string factura,
            string estado,string fechainicio,string fechafin, int top)
        {
            var data =await DAO.GetListaAnalisisOrganolepticoAsync(codigo, sucursal, factura, estado,fechainicio,fechafin, top);
            return Json(data);
        }

      
        public async Task<IActionResult> getAnalisisOrganolepticoCompleto(int id)
        {
            var data = await DAO.GetAnalisisOrganolepticoCompletoAsync(id);
            return Json(data);
        }

        private async Task datosinicioViewBagAsync()
        {
            var modelo = await EF.datosinicioViewBagAsync();
            ViewBag.documentotributario = modelo.documentotributario;
        }

        [HttpPost]
        public IActionResult GenerarPDF(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFHorizontalA4(url, Request.Cookies, "AnalisisOrganoleptico","horizontal");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [HttpPost]
        public IActionResult GenerarPDFvertical(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "AnalisisOrganoleptico", "horizontal");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        
    }
}
