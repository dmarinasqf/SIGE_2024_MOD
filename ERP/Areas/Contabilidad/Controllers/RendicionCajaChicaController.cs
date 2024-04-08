using ClosedXML.Excel;
using ENTIDADES.Identity;
using Erp.Entidades.Contabilidad;
using Erp.Infraestructura.Areas.Contabilidad.DAO;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Contabilidad.Controllers
{
    [Area("Contabilidad")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class RendicionCajaChicaController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly RendicionCajaChicaDAO DAO;

        public RendicionCajaChicaController(IWebHostEnvironment ruta_, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new RendicionCajaChicaDAO(settings.GetConnectionString());
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult Buscar(string id)
        {
            datosinicio();
            var rendicion = DAO.RendicionCajaChicaBuscar(id);
            ViewBag.Rendicion = rendicion;
            return PartialView();
        }

        //acciones para consultar y rendir gastos dependiendo del rol
        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult ConsultarFicha(string id)
        {
            datosinicio();
            ViewBag.idSucursalResp = id;
            //var rendicion = DAO.RendicionCajaChicaBuscar(id);
            //ViewBag.Rendicion = rendicion;
            return PartialView();
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult RendirGastos(string id)
        {
            datosinicio();
            int idSucursal = getIdSucursal();
            ViewBag.idsucursal = idSucursal;
            ViewBag.conceptos = DAO.RendicionConceptoListar(idSucursal);
            ViewBag.idSucursalResp = id;
            ViewBag.idCajaChica = DAO.RendicionCajaChicaBuscar(id).idCajaChica;
            //var rendicion = DAO.RendicionCajaChicaBuscar(id);
            //ViewBag.Rendicion = rendicion;
            return PartialView();
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult consultarFichaRendicion(string id)
        {
            //var codigo = Convert.FromBase64String(id);
            //var rendicion = DAO.RendicionCajaChicaBuscar(Encoding.UTF8.GetString(codigo));
            var rendicion = DAO.RendicionCajaChicaBuscar(id);
            return Json(JsonConvert.SerializeObject(rendicion));
        }


        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        [HttpPost]
        public IActionResult RendicionAgregarDetalleItem(RendicionCajaChicaDetalle rendicion, IFormFile imgFile)
        {
            if (imgFile != null)
            {
                if (imgFile.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        imgFile.CopyTo(ms);
                        var imgBytes = ms.ToArray();
                        rendicion.recursoImg = imgBytes;
                    }
                }
            }
            var respuesta = DAO.RendicionAgregarDetalleItem(rendicion);
            return Json(JsonConvert.SerializeObject(respuesta));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        [HttpPost]
        public IActionResult cajaRendicionListarUser(string emp_codigo, string fechaInicial, string fechaFinal)
        {
            var datos = DAO.cajaRendicionListarUser(emp_codigo, fechaInicial, fechaFinal);
            return Json(JsonConvert.SerializeObject(datos));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        [HttpPost]
        public IActionResult RendicionEliminarDetalleItem(string id)
        {
            var datos = DAO.RendicionEliminarDetalleItem(id);
            return Json(JsonConvert.SerializeObject(datos));
        }

        [Authorize(Roles = "ADMINISTRADOR, VER RENDICION CAJA CHICA")]
        public IActionResult ExportarRendicionExcel(string id)
        {
            var rendicion = DAO.RendicionCajaChicaBuscar(id);

            DataTable dt = new DataTable("DETALLE_RENDICION");
            dt.Columns.AddRange(new DataColumn[10] { new DataColumn("FECHA"),
                                            new DataColumn("CONCEPTO"),
                                            new DataColumn("TIPO DOC"),
                                            new DataColumn("N° RUC"),
                                            new DataColumn("N° SERIE"),
                                            new DataColumn("N° DOC"),
                                            new DataColumn("DESCRIPCIÓN"),
                                            new DataColumn("MONTO"),
                                            new DataColumn("SALDO"),
                                            new DataColumn("DETALLE")});

            var detalle_rendicion = from det_rendicion in rendicion.detalleCaja select det_rendicion;

            dt.Rows.Add(rendicion.fechaUltimaRep, "INGRESOS", "-", "-","-","-","-","-", rendicion.montoCajaChica, "MONTO CAJA CHICA");
            foreach (var item in detalle_rendicion)
            {
                var concepto = item.tipo_op == "RENDICION" ? "EGRESOS" : "INGRESOS";
                dt.Rows.Add(item.fecha, concepto,item.tipoDoc,item.numRuc, item.numSerie,item.numDoc,  item.tipoGastos, item.total, item.saldo, item.comentarios);
            }

            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add(dt);
                worksheet.Columns().AdjustToContents();

                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "detalle_rendicion.xlsx");
                }
            }
        }

    }
}
