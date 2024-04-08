using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENTIDADES.Almacen;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Crypto.Prng.Drbg;
using System.Globalization;
using System.IO;
using OfficeOpenXml.Style;
using OfficeOpenXml;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AIngresoController : _baseController
    {
        private readonly IIngresoManualEF EF;
        private readonly IngresoManualDAO   DAO;
        public AIngresoController(IIngresoManualEF EF_,ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = EF_;
            LeerJson settings = new LeerJson();
            DAO = new IngresoManualDAO(settings.GetConnectionString());
        }
        [ResponseCache(NoStore = true, Duration = 0)]
        public IActionResult Index()
        {
            datosinicio();

            return View();
        }
        [Authorize(Roles ="ADMINISTRADOR, INGRESO STOCK")]
        [ResponseCache(NoStore = true, Duration = 0)]
        public IActionResult Registrar()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, INGRESO STOCK")]
        [HttpPost]
        public async Task<IActionResult> Registrar(AIngresoManual ingreso)
        {
            ingreso.idempresa = getEmpresa();
            ingreso.idsucursal = getIdSucursal();
            return Json(await EF.RegistrarAsync(ingreso));

        }
        public IActionResult getHistorialIngresos(string sucursal, string fechainicio, string fechafin, int top)
        {
            if (sucursal is null || sucursal is "")
                if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                    sucursal = getIdSucursal().ToString() ;
            var data = DAO.getHistorialIngresos(sucursal, fechainicio, fechafin, top);
            return Json(JsonConvert.SerializeObject(data));
        }

        //Reporte ingresos manualyex
        public IActionResult ReporteManualStock(int idsucursal)
        {
            datosinicio();

            return View();
        }


        public IActionResult listaralmacenporsurcursal(int idsucursal)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            var data = DAO.listarmanualxstock(idsucursal);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> reporteStockManual(string sucursal, string fechainicio, string fechafin)
        {// Convertir el string 'año/mes/dia' a DateTime
            DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


            // Convertir el DateTime a string 'dia/mes/año'
            fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
            fechafin = fechaFinDT.ToString("dd/MM/yyyy");
            if (sucursal is null)
            {
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                {
                    sucursal = "100";
                }
                else
                {
                    sucursal = getIdSucursal().ToString();
                }
            }


            var rows = await DAO.reporteStockManual(sucursal, fechainicio, fechafin);
            return Json(new { rows });
        }

        public IActionResult GetEpllusexportarExcel(string sucursal, string fechainicio, string fechafin)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();
            DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


            // Convertir el DateTime a string 'dia/mes/año'
            fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
            fechafin = fechaFinDT.ToString("dd/MM/yyyy");

            try
            {
                var dataArray = DAO.exportarexcelReporteIngresoManualEpplus(sucursal,fechainicio, fechafin);

                using (ExcelPackage package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Reporte");

                    var rows = new List<object[]>();
                    for (int row = 0; row < dataArray.GetLength(0); row++)
                    {
                        object[] currentRow = new object[dataArray.GetLength(1)];
                        for (int col = 0; col < dataArray.GetLength(1); col++)
                        {
                            currentRow[col] = dataArray[row, col];
                        }
                        rows.Add(currentRow);
                    }

                    // Usando la función LoadFromArrays de EPPlus
                    worksheet.Cells["A1"].LoadFromArrays(rows);

                    // Ajustar el ancho de las columnas al contenido
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Agregar formato de tabla
                    var tableRange = worksheet.Cells[1, 1, dataArray.GetLength(0), dataArray.GetLength(1)];
                    var table = worksheet.Tables.Add(tableRange, "ReporteTable");
                    table.ShowHeader = true;
                    table.TableStyle = OfficeOpenXml.Table.TableStyles.Medium1;

                    // Cambiar el color de fondo de la cabecera a verde
                    using (var headerCells = worksheet.Cells[1, 1, 1, dataArray.GetLength(1)])
                    {
                        headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        headerCells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Green);
                        headerCells.Style.Font.Color.SetColor(System.Drawing.Color.White); // Color de texto blanco para mejor contraste
                    }

                    // (Puedes agregar más configuraciones de estilo aquí si lo deseas)

                    var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    var excelFileName = "reporte.xlsx";

                    var stream = new MemoryStream(package.GetAsByteArray());
                    return new FileContentResult(stream.ToArray(), contentType)
                    {
                        FileDownloadName = excelFileName
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return RedirectToAction("Error", "Home");
            }
        }




        //fin de reporte manual

    }
}
