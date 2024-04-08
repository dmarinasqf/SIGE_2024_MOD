using ENTIDADES.Identity;
using Erp.Entidades.pedidos;
using Erp.Infraestructura.Areas.Pedido.DAO;
using Erp.Infraestructura.Areas.Ventas.cajas.query;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Gdp.Infraestructura.Pedidos.pagos;
using Gdp.Infraestructura.Pedidos.reportes;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ReporteController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        private readonly PedidoDAO DAO;
        private readonly ReporteAlmacenDAO SUCDAO;
        public ReporteController(IWebHostEnvironment ruta_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new PedidoDAO(settings.GetConnectionString());
            SUCDAO = new ReporteAlmacenDAO(settings.GetConnectionString());
        }

        public async Task<IActionResult> General()
        {
            var inicio = await _mediator.Send(new DatosInicio.Ejecutar());
            ViewBag.estadopedido = inicio.estadopedido;
            ViewBag.empresas = inicio.empresas;
            ViewBag.tipoformulacion = inicio.tipoformulacion;
            ViewBag.tipopedido = inicio.tipopedido;
            ViewBag.tipoproducto = inicio.tipoproducto;
            datosinicio();
            return View();
        }

        public async Task<IActionResult> FormulasMagistrales()
        {
            var inicio = await _mediator.Send(new DatosInicio.Ejecutar());
            ViewBag.estadopedido = inicio.estadopedido;
            ViewBag.empresas = inicio.empresas;
            ViewBag.tipoformulacion = inicio.tipoformulacion;
            ViewBag.tipopedido = inicio.tipopedido;
            ViewBag.tipoproducto = inicio.tipoproducto;
            datosinicio();
            return View();
        }
        public IActionResult GeneralxPedido()
        {
            datosinicio();
            return View();
        }
        public IActionResult Recepcion_Validacion()
        {
            datosinicio();
            int idsucursal = Convert.ToInt32(ViewBag.IDSUCURSAL);
            ViewBag.sucursales2 = SUCDAO.ListarSucursales(idsucursal).AsEnumerable();
            return View();
        }

        public IActionResult FmComlejidadFormulacion()
        {
            datosinicio();
            return View();
        }
        public IActionResult Rendimiento()
        {
            datosinicio();
            return View();
        }

        public IActionResult Deposito()
        {
            datosinicio();
            return View();
        }
        public IActionResult Delivery()
        {
            datosinicio();
            return View();
        }
        public IActionResult FormulaMagistral()
        {
            datosinicio();
            return View();
        }
        public IActionResult FmComplejidadxFormulador()
        {
            datosinicio();
            return View();
        }

        public IActionResult ProduccionxLaboratorio()
        {
            datosinicio();
            return View();
        }
        public IActionResult xDiayHora()
        {
            datosinicio();
            return View();
        }
        public IActionResult PedidosConAdelanto()
        {
            datosinicio();
            return View();
        }
        public IActionResult HoraOPTerminado()
        {
            datosinicio();
            return View();
        }
        public IActionResult ProduccionPorLaboratorio()
        {
            datosinicio();
            return View();
        }


        public async Task<IActionResult> GetReporteGeneral(ReporteGeneral.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> GetReporteFormulasMagistral(ReporteFormulasMagistrales.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> GetReporteDelivery(ReporteDelivery.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> GetReportePedidosConAdelanto(ReportePedidosConAdelanto.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> GetReporteXDiasYHora(ReporteXDiayHora.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetHoraOpTerminado(ReporteHoraOpTerminado.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> GetProduccionPorLaboratorio(ReporteProduccionPorLaboratorio.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }


        public async Task<IActionResult> GetReporteGeneralxPedido(GeneralxPedido.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteRendimiento(Rendimiento.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReportefmComlejidadFormulacion(FmComlejidadFormulacion.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteDeposito(Depositos.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteProduccionxLaboratorio(ReporteProduccionxLaboratorio.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteListarCajasCerradas(ListarCajasCerradas.Ejecutar data)
        {
            data.path = ruta.WebRootPath;
            return Json(await _mediator.Send(data));
        }
        public IActionResult ReporteRecepcion_Validacion(string fecha,int sucursal)
        {
            var data = DAO.ReporteRecepcion_Validacion(fecha,sucursal);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> GenerarExcelReportevalidacion()
        {
            var data = await DAO.GenerarExcelReportevalidacion(ruta.WebRootPath);
            return Json(data);
        }
        public IActionResult ImprimirFormatoRecepcion_Validacion() {

            int idsucursal = getIdSucursal();

            var data = DAO.ImprimirConsulta(idsucursal);
            return View(data);
        }

        //------------CODIGO REPORTE GENERAL YEX----
        public async Task<IActionResult> GetReporteGenerallistartabla(ReporteGeneralExportar obj)
        {
            var dataTable = await DAO.listartablaArrayAsync(obj);
            return Json(dataTable);
        }


        public IActionResult GetEpllusexportarExcel(ReporteGeneralExportar datos)
        {
            try
            {
                var dataArray = DAO.exportarexcelEpplus(datos);

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


        //FIN REPROTE GENERALYEXSON
    }
}