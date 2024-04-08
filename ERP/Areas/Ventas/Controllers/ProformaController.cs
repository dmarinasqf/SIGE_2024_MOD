using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf.Contracts;
using ENTIDADES.ventas;
using ERP.Controllers;
using ERP.Models.Ayudas;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Proformas.EF;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Erp.SeedWork;
using Erp.Infraestructura.Areas.Ventas.proforma.query;
using Erp.SeedWork.Report;
using Erp.Report.Dtos.Ventas;

namespace ERP.Areas.Ventas.Controllers
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ProformaController : _baseController
    {
        private readonly IProformaEF EF;
        private readonly Modelo db;
        private readonly ProformaDAO DAO;
        private readonly IConverter pdf;
        private readonly IReportService report;
        public ProformaController(Modelo _db, IProformaEF _EF,IConverter pdf_,  ICryptografhy crytografhy, SignInManager<AppUser> signInManager, IReportService _report) : base(crytografhy, signInManager)
        {
            EF = _EF;
            db = _db;
            pdf = pdf_;
            report = _report;
            LeerJson settings = new LeerJson();
            DAO = new ProformaDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR PROFORMA")]
        public IActionResult Proforma(long? idproforma)
        {
            ViewBag.IGV = db.CCONSTANTE.Find("IGV").valor;
            datosinicio();
            if (idproforma is null)
                return View();
            var proforma = db.PROFORMA.Find(idproforma);
            if (proforma is null)
                return NotFound();
            return View(proforma);
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL DE PROFORMAS")]
        public IActionResult HistorialProformas()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL DE PROFORMAS")]
        public IActionResult ImprimirProforma1(int id)
        {
            var data = DAO.GetProformaCompleta(id);
            return View(data);
        }
        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR PROFORMA")]
        public async Task<IActionResult> Proforma(Proforma proforma)
        {

            proforma.idsucursal = getIdSucursal();          
            proforma.idempresa = getEmpresa();
            return Json(await EF.RegistrarProformaDirectaAsync(proforma));
        }
        public async Task<IActionResult> GetHistorialProformas (string fechainicio, string fechafin, string sucursal, string numdocumento, int top,int numsemanas,string estado)
        {
            if (sucursal is null && (!User.IsInRole("ADMINISTRADOR") || !User.IsInRole("ACCESO A TODAS LAS SUCURSALES")))
            {
                sucursal = getIdSucursal().ToString();
            }
            var data = await DAO.HistorialProformasAsync(fechainicio, fechafin, sucursal, numdocumento, top, numsemanas,estado);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult GetProformaCompletaxId(long idproforma,int rangodias)
        {
            var proforma = db.PROFORMA.Find(idproforma);
            if (proforma is null)
                return Json(new { mensaje = "No existe proforma" });
            var fecha = DateTime.Now.AddDays(-rangodias);
            if(proforma.fecha.Date>=fecha.Date)
            {
                var data = DAO.GetProformaCompleta(idproforma);
                return Json( new { mensaje="ok", tabla = JsonConvert.SerializeObject(data) });
            }else
            {
                return Json(new { mensaje = $"La proforma N°{idproforma}, ha vencido." });

            }

        }
        public IActionResult GetProformaCompletaxCodigoProforma(string codigo, int rangodias)
        {
            var proforma = db.PROFORMA.Where(x=>x.codigoproforma== codigo && x.idsucursal==getIdSucursal()).ToList().LastOrDefault();
            if (proforma is null)
                return Json(new { mensaje = "No existe proforma" });
            var fecha = DateTime.Now.AddDays(-rangodias);
            if (proforma.fecha.Date >= fecha.Date)
            {
                var data = DAO.GetProformaCompleta(proforma.idproforma);
                return Json(new { mensaje = "ok", tabla = JsonConvert.SerializeObject(data) });
            }
            else
            {
                return Json(new { mensaje = $"La proforma N°{proforma.idproforma}, ha vencido." });

            }

        }
        public async Task<IActionResult> GetProformaParaPedido(BuscarProformaParaPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GenerarPDFTicket(GetProformaReport.Ejecutar obj)
        {
            try
            {
                //LeerJson settings = new LeerJson();
                //url = settings.LeerDataJson("App:https") + url;
                //GenerarPDF generarPDF = new GenerarPDF();
                //var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "proforma","vertical");
                //var file = pdf.Convert(document);
                //return File(file, "application/pdf");              
                var file = await _mediator.Send(obj);
                if (file is null) {
                    return BadRequest();
                }
                else {
                    return File(file, System.Net.Mime.MediaTypeNames.Application.Octet, "proforma" + ".pdf");
                }              

            }
            catch (Exception e)
            {
                return BadRequest();
            }
 
        }
        public IActionResult GenerarPDFTicket2(string url) {
            try {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "proforma", "vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception e) {
                return BadRequest();
            }

        }
    }
}
