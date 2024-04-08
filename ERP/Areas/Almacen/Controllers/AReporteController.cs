using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Linq;
using Erp.Persistencia.Servicios.Users;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.SeedWork;
using System.Globalization;
using Erp.Persistencia.Modelos;
using System.IO;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace ERP.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AReporteController : _baseController
    {
        private readonly IGuiaSalidaEF EF;
        private readonly ReporteAlmacenDAO DAO;
        private readonly IWebHostEnvironment ruta;
        private readonly IUser user;

        private readonly Modelo db;
        public AReporteController(IGuiaSalidaEF context, IWebHostEnvironment _ruta, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager, Modelo _db) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new ReporteAlmacenDAO(settings.GetConnectionString());
            ruta = _ruta;
            user = _user;
            db = _db;
        }
        [Authorize(Roles = "ADMINISTRADOR, REPORTE KARDEX")]
        public IActionResult Kardex()
        {
            datosinicio();
            return View();
        }
        [HttpPost]
        public IActionResult ReporteKardex(int producto, int almacen, int top, string fechainicio, string fechafin)
        {
            var data = DAO.ReporteKardex(producto, almacen, top, fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        [HttpPost]
        public async Task<IActionResult> GenerarExcelKardex(int producto, int almacen, int top, string fechainicio, string fechafin)
        {

            var data = await DAO.GenerarExcelKardexAsync(producto, almacen, top, fechainicio, fechafin, ruta.WebRootPath);
            return Json(data);
        }
        public string MonthName(int month)
        {
            DateTimeFormatInfo dtinfo = new CultureInfo("es-ES", false).DateTimeFormat;
            return dtinfo.GetMonthName(month);
        }
        public IActionResult ReporteAnalisisProducto(int producto, string fechainicio)
        {
            DataTable dt = new DataTable();
            DataTable dtventasvscompras = new DataTable();
            DataTable dtConsumoEconomato = new DataTable();
            //CAMBIOS SEMANA3
            DataTable dttotal = new DataTable();
            DataTable dttotalConsumoEconomato = new DataTable();

            dtventasvscompras = DAO.ReporteVentasVsCompras(producto, fechainicio);
            dt = DAO.ReporteVentasMensualesXproducto(producto, DateTime.Now.Year);
            dtConsumoEconomato = DAO.BuscarUltimos10ConsumoEconomato(producto);
            int multiplo = DAO.getmultiploxproducto(producto);

            DataRow wr = null;
            int finmes = Convert.ToInt32(DateTime.Now.ToString("MM"));
            DateTime fec = DateTime.Now;
            DateTime nfec;
            //int ini = 0, pos = 7;
            //CAMBIOS SEMANA3
            int ini = 0, pos = dt.Columns.Count - 1;
            dttotal = dt.Copy();
            dttotal.Clear();
            wr = dt.NewRow();
            wr[0] = "FECHA";
            for (int a = -5; a <= 0; a++)
            {
                nfec = fec.AddMonths(a);
                string name = (MonthName(nfec.Month) + '(' + nfec.Year + ')');
                if (pos > 1) dt.Columns[pos].ColumnName = name;
                pos--;
            }

            DataRow wrE = null;
            int finmesE = Convert.ToInt32(DateTime.Now.ToString("MM"));
            DateTime fecE = DateTime.Now;
            DateTime nfecE;
            int posE = 7;
            dttotalConsumoEconomato = dtConsumoEconomato.Copy();
            dttotalConsumoEconomato.Clear();
            wrE = dtConsumoEconomato.NewRow();
            wrE[0] = "FECHA";
            for (int a = -5; a <= 0; a++)
            {
                nfecE = fecE.AddMonths(a);
                string nameE = (MonthName(nfecE.Month) + '(' + nfecE.Year + ')');
                if (posE > 1) dtConsumoEconomato.Columns[posE].ColumnName = nameE;
                posE--;
            }

            int i = 0, suma;
            wr = dttotal.NewRow();
            //wr = dt.NewRow();
            wr[0] = "TOTAL";
            foreach (DataColumn col in dt.Columns)
            {
                i++;
                suma = 0;
                foreach (DataRow row in dt.Rows)
                {
                    //CAMBIOS SEMANA3
                    if (i < dt.Columns.Count)
                    {
                        //if (i < 8) {
                        string fraccion = row[i].ToString();
                        if (fraccion.Contains("F"))
                        {
                            string[] conversion = fraccion.Split("F");
                            suma += Convert.ToInt32(conversion[0]) * multiplo + Convert.ToInt32(conversion[1]);
                        }
                        else
                        {
                            suma += Convert.ToInt32(row[i]) * multiplo;
                        }
                    }
                }
                string totalfraccion = "";

                if (multiplo > 1)
                {
                    if (suma == 0)
                    {
                        totalfraccion = Convert.ToString(0);
                    }
                    else if (suma > 0)
                    {
                        totalfraccion = Convert.ToString((suma / multiplo) + "F" + (suma % multiplo));
                    }
                }
                else
                {
                    totalfraccion = Convert.ToString(suma);
                }
                //CAMBIOS SEMANA3
                if (i < dt.Columns.Count) wr[i] = totalfraccion;
                // if (i < 8) wr[i] = totalfraccion;

            }
            //CAMBIOS SEMANA3
            dttotal.Rows.Add(wr);
            //dt.Rows.Add(wr);
            //agregar este var query a el dt
            //var ventasmensuales = dt;
            var lista = new List<string>();
            var ventasmensuales = dt;
            var ventasvscompras = dtventasvscompras;
            //CAMBIOS SEMANA3
            var ventasmensualestotal = dttotal;
            var ConsumoEconomato = dtConsumoEconomato;

            lista.Add(JsonConvert.SerializeObject(ventasvscompras));
            lista.Add(JsonConvert.SerializeObject(ventasmensuales));
            //CAMBIOS SEMANA3
            lista.Add(JsonConvert.SerializeObject(ventasmensualestotal));
            lista.Add(JsonConvert.SerializeObject(ConsumoEconomato));
            return Json(lista);
        }
        [Authorize(Roles = "ADMINISTRADOR, ANALISIS")]
        public async Task<IActionResult> Analisis()
        {
            datosinicio();
            await datosinicioAsync();
            return View(await EF.ListarAsync());
        }
        public IActionResult ReporteAnalisisStock(string alerta, string sucursal, string laboratorio)
        {//Task<mensajeJson>
            int idempresa = user.getIdEmpresaCookie();
            if (laboratorio is null) laboratorio = "";
            if (sucursal is null) sucursal = "";
            try
            {
                var data = DAO.ReporteAnalisisStock(alerta, sucursal, laboratorio, idempresa);
                //return new mensajeJson("ok", JsonConvert.SerializeObject(data));
                return Json(JsonConvert.SerializeObject(data));
                //return Json(new { mensaje = "Ok", tabla = JsonConvert.SerializeObject(data) });
            }
            catch (Exception e) { return null;/*return new mensajeJson(e.Message, new DataTable());*/ }
        }
        public async Task<IActionResult> ReporteAnalisisStockasync(string alerta, string sucursal, string laboratorio)
        {//Task<mensajeJson>
            int idempresa = user.getIdEmpresaCookie();
            if (laboratorio is null) laboratorio = "";
            if (sucursal is null) sucursal = "";

            //var data = DAO.ReporteAnalisisStock(alerta, sucursal, laboratorio, idempresa);
            return Json(await DAO.ReporteAnalisisStockasync(alerta, sucursal, laboratorio, idempresa));
            //return Json(JsonConvert.SerializeObject(data));

        }
        public async Task<IActionResult> GenerarExcelAnalisisStock(int sucursal)
        {
            int idempresa = user.getIdEmpresaCookie();
            var data = await DAO.GenerarExcelAnalisisStock(sucursal, idempresa, ruta.WebRootPath);
            return Json(data);
        }
        [Authorize(Roles = "ADMINISTRADOR, ESENCIAL")]
        public IActionResult Esencial()
        {
            datosinicio();
            return View();
        }
        public IActionResult ReporteEsencial(string sucursal, string laboratorio)
        {
            int idempresa = user.getIdEmpresaCookie();
            if (laboratorio is null) laboratorio = "";
            if (sucursal is null) sucursal = "";
            var data = DAO.ReporteEsencial(sucursal, laboratorio, idempresa);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelEsencial(int sucursal)
        {
            int idempresa = user.getIdEmpresaCookie();
            var data = await DAO.GenerarExcelEsencial(sucursal, idempresa, ruta.WebRootPath);
            return Json(data);
        }

        private async Task datosinicioAsync()
        {
            var modelo = await EF.datosinicioAsync();
            ViewBag.empresas = modelo.empresa;
            ViewBag.clases = modelo.clase;
            ViewBag.sucursales = modelo.sucursal;
        }

        //----------------------------------------
        ///EARTC10000
        [Authorize(Roles = "ADMINISTRADOR, GUIAS_TRANSFERENCIAS")]
        public IActionResult GuiasTransferencias()
        {
            ViewBag.empresas = db.EMPRESA.ToList();
            datosinicio();
            return View();
        }


        public IActionResult StockValorizado()
        {
            ViewBag.empresas = db.EMPRESA.ToList();
            datosinicio();
            return View();
        }

        public IActionResult ReporteGuiasTransferencias(string codigo, string estado, string tipo, string idempresa)
        {
            if (codigo is null) codigo = "";
            if (estado is null) estado = "";
            if (tipo is null) tipo = "";
            if (idempresa is null) idempresa = "";
            var data = DAO.GuiasTransferencias(codigo, estado, tipo, idempresa);
            return Json(JsonConvert.SerializeObject(data));
        }

        public async Task<IActionResult> GenerarExcelGuiasTransferencias()
        {
            var data = await DAO.GenerarExcelGuiasTransferencias(ruta.WebRootPath);
            return Json(data);
        }

        //----------------------------------------
        ///EARTC10001
        [Authorize(Roles = "ADMINISTRADOR, REPORTE_GUIAS")]
        public IActionResult Guias()
        {
            datosinicio();
            int idsucursal = Convert.ToInt32(ViewBag.IDSUCURSAL);
            ViewBag.sucursales1 = DAO.ListarSucursales(100).AsEnumerable();
            ViewBag.sucursales2 = DAO.ListarSucursales(idsucursal).AsEnumerable();
            return View();
        }

        public IActionResult ReporteGuias(int sucursalorigen, int sucursaldestino, string numdocumento)
        {
            if (numdocumento is null) numdocumento = "";
            var data = DAO.ReporteGuias(sucursalorigen, sucursaldestino, numdocumento);
            return Json(JsonConvert.SerializeObject(data));
        }

        public async Task<IActionResult> GenerarExcelReporteGuias()
        {
            var data = await DAO.GenerarExcelReporteGuias(ruta.WebRootPath);
            return Json(data);
        }


        // STOK VALORIZADO YEX
        public async Task<IActionResult> stockvalorizadoListar(string sucursal)
        {
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


            var rows = await DAO.stockvalorizado(sucursal);
            return Json(new { rows });
        }

        public IActionResult CostoInventario()
        {
            ViewBag.empresas = db.EMPRESA.ToList();
            datosinicio();
            return View();
        }
        public IActionResult ReporteCostoInventario(string idsucursal, string fechainicio, string fechafin)
        {
            var data = DAO.ReporteCostoInventario(idsucursal, fechainicio, fechafin);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarCostoInventario(string idsucursal, string fechainicio, string fechafin)
        {

            var data = await DAO.GenerarCostoInventarioAsync(idsucursal, fechainicio, fechafin, ruta.WebRootPath);
            return Json(data);
        }

        public IActionResult GetEpllusexportarExcel(string sucursal)
        {
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


            try
            {
                var dataArray = DAO.exportarexcelEpplus(sucursal);

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
        ///  hola 
        ///  
        // reporte pdf stock yex
        public IActionResult ImprimirReporteStock(string producto = "", string sucursal = "", string laboratorio = "", string almacen = "")
        {
            datosinicio();

            producto = producto ?? "";
            sucursal = sucursal ?? "";
            laboratorio = laboratorio ?? "";
            almacen = almacen ?? "";

            var data = DAO.ReportePdfStock(producto, sucursal, laboratorio, almacen);
            return View(data);
        }
    }
}
