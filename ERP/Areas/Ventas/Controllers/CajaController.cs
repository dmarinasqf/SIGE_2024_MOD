using System;
using System.Collections.Generic;
using System.Linq;
using DinkToPdf.Contracts;
using System.Threading.Tasks;
using ENTIDADES.ventas;
using DinkToPdf.Contracts;
using ERP.Controllers;
using ERP.Models.Ayudas;
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Ventas.DAO;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.SeedWork;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Erp.Infraestructura.Areas.Ventas.cajas.command;
using Erp.Infraestructura.Areas.Ventas.cajas.query;
using Microsoft.AspNetCore.Hosting;
using Erp.Persistencia.Servicios.Users;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using System.Net;

namespace ERP.Areas.Ventas.Controllers
{
    [Area("Ventas")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class CajaController : _baseController
    {
        private readonly ICajaVentaEF EF;
        private readonly IConverter pdf;
        private readonly IUser user;
        private readonly CajaDAO DAO;
        private readonly IWebHostEnvironment ruta;
        private object pechkin;

        public CajaController(IWebHostEnvironment ruta_, IUser _user, IConverter _pdf, ICajaVentaEF _EF, ICryptografhy crytografhy, SignInManager<AppUser> signInManager) : base(crytografhy, signInManager)
        {
            EF = _EF;
            pdf = _pdf;
            user = _user;
            ruta = ruta_;
            LeerJson settings = new LeerJson();
            DAO = new CajaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = "ADMINISTRADOR, APERTURAR CAJA")]
        public IActionResult AperturarCaja()
        {
            datosinicio();
            return View();
        }
        public IActionResult HistorialCaja()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR")]
        public IActionResult ReporteCajacerradas()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "ADMINISTRADOR, CERRAR CAJA")]
        public IActionResult CerrarCaja(int? idaperturacaja)
        {
            datosinicio();
            if (idaperturacaja is null)
                ViewBag.verificarcaja = EF.VerificarSiHayCajaAbiertaParaCierre(getIdEmpleado().ToString());
            else
            {
                if (User.IsInRole("ADMINISTRADOR") || User.IsInRole("AUDITORIA CAJA"))
                    ViewBag.verificarcaja = new mensajeJson("ok", EF.GetCajaAperturada(idaperturacaja.Value));
                else
                    return BadRequest();
            }
            return View();
        }
        public IActionResult GenerarPDFCierre(int id)
        {
            var data = EF.GetDatosCierreCajaPDF(id);
            if (data.mensaje != "ok")
                return NoContent();
            return View(data);
        }
        [Authorize(Roles = "ADMINISTRADOR, AUDITORIA CAJA")]
        public IActionResult AuditoriaCaja()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, APERTURAR CAJA")]
        [HttpPost]
        public IActionResult AperturarCaja(int idcajasucursal, decimal montoinicial)
        {
            return Json(EF.AperturarCaja(idcajasucursal, montoinicial));
        }
        [Authorize(Roles = "ADMINISTRADOR, CERRAR CAJA")]
        [HttpPost]
        public async Task<IActionResult> CerrarCaja(int idapertura, List<CerrarCaja> cierre, string observaciones)
        {
            return Json(await EF.CerrarCajaAsync(idapertura, cierre, observaciones));
        }
        public IActionResult ListarCajaSucursal(int? idsucursal)
        {
            if (idsucursal is null)
                idsucursal = this.getIdSucursal();
            return Json(EF.ListarCajaSucursal(idsucursal.Value));
        }
        public IActionResult GetDatosCierre(int idaperturacaja)
        {
            //return Json(JsonConvert.SerializeObject(DAO.GetDatosCierre(idaperturacaja)));//EARTCOD1011
            return Json(JsonConvert.SerializeObject(DAO.GetDatosCierre(idaperturacaja)));
        }
        [HttpPost]
        public IActionResult GenerarPDFCierre(string url)
        {
            try
            {
                LeerJson settings = new LeerJson();
                url = settings.LeerDataJson("App:https") + url;
                GenerarPDF generarPDF = new GenerarPDF();
                var document = generarPDF.GenererarPDFVerticalA4(url, Request.Cookies, "Cierre_caja", "vertical");
                var file = pdf.Convert(document);
                //return File(file, "application/pdf");
                return Json(file);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        public IActionResult ListarCajaAbiertas()
        {
            return Json(EF.ListarCajaAbiertas());
        }
        public IActionResult GetCajasCerradas(string fecha, string fechafin)
        {
            return Json(JsonConvert.SerializeObject(DAO.GetCajasCerradas(fecha, fechafin)));
        }
        public IActionResult ListarCajasPorfechaYUsuario(DateTime? fecha, int? usuario)
        {
            usuario = usuario ?? getIdEmpleado();
            fecha = fecha ?? DateTime.Now;
            return Json(EF.ListarCajasPorfechaYUsuario(fecha.Value, usuario.Value));
        }

        public async Task<IActionResult> GuardarPreCierre(GuardarPreCierre.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> GetReporteListarCajasCerradas(ListarCajasCerradas.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }


        public IActionResult Deposito()
        {
            datosinicio();
            return View();
        }

        public IActionResult Reporte()
        {
            datosinicio();
            return View();
        }

        public IActionResult ReporteCierreCaja()
        {
            datosinicio();
            return View();
        }

      
        public IActionResult ListarCuadreCajeLocales(int idsucursal,string fechainicio, string fechafin)
        {
            return Json(JsonConvert.SerializeObject(DAO.ListarCuadreCajeLocales(idsucursal, fechainicio, fechafin)));
        }
        public IActionResult ListarCajaMontosXFechaXSucursal(string fechainicio, string fechafin)
        {
            int idempleado = Convert.ToInt32(user.getIdUserSession());
            int idsucursal = Convert.ToInt32(user.getIdSucursalCookie());
            return Json(JsonConvert.SerializeObject(DAO.ListarCajaMontosXFechaXSucursal(idempleado, idsucursal, fechainicio, fechafin)));
        }
        public async Task<IActionResult> RegistrarDepositoCaja(string jsondeposito)
        {
            return Json(await EF.RegistrarDepositoCaja(jsondeposito));
        }




        //CODIGO PARA EL DESCARGAR EL EXCEL CON FORMATOS ESPECIFICOS PARA CAJA --YEX
        public async Task<IActionResult> GetHistorialVentaslistarArray(string idsucursal, string fechainicio, string fechafin)
        {
            if (idsucursal is null)
                idsucursal = getIdSucursal().ToString();

            var rows = await DAO.ListarcajaArrayAsync(idsucursal, fechainicio, fechafin);
            return Json(new { rows });
        }
        //CODIGO EXPORTAR EXCEL con formato bien documentado
        public IActionResult GetEpllusexportarExcel(string idsucursal, string fechainicio, string fechafin)
        {
            if (idsucursal is null)
                idsucursal = getIdSucursal().ToString();
            DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


            // Convertir el DateTime a string 'dia/mes/año'
            fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
            fechafin = fechaFinDT.ToString("dd/MM/yyyy");

            try
            {
                var dataArray = DAO.exportarexcelCajaEpplus(idsucursal, fechainicio, fechafin);
                // Verificar si dataArray tiene solo cabeceras
                if (dataArray == null || dataArray.GetLength(0) <= 1)
                {
                    //si no tiene datos se devuelve vacio, solo para aclarar se esta haciendo mayor a 1 ya que tambien se esta opteniendo las cabeceras y siempre ...
                    // se retornara 1 fila que son las cabceras tengan dato o no.
                    // Enviar respuesta con indicador de error y mensaje
                    var response = new { success = false, message = "No se encontraron datos para generar el informe." };
                    return Json(response);


                }
                using (ExcelPackage package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("CUADRE DE CAJA");

                    var rows = new List<object[]>();

                    // Empezar desde la sexta fila, ya que los encabezados ocupan las primeras 5 filas.
                    for (int row = 1; row < dataArray.GetLength(0); row++)
                    {
                        object[] currentRow = new object[dataArray.GetLength(1) - 1]; // Ajustamos para tomar una columna menos.
                        for (int col = 1; col < dataArray.GetLength(1); col++) // Empezamos desde 1 para omitir la primera columna
                        {
                            currentRow[col - 1] = dataArray[row, col]; // col - 1 para llenar desde la primera posición de currentRow.
                        }
                        rows.Add(currentRow);
                    }

                    // Usando la función LoadFromArrays de EPPlus, pero empezando desde la fila 5 para dejar 4 líneas vacías, y empezando desde la columna B.
                    worksheet.Cells["B5"].LoadFromArrays(rows); // Corrección en el nombre del método "LoaydFromArrays" a "LoadFromArrays".

                    worksheet.DeleteColumn(1);
                    // Ajustar el ancho de las columnas al contenido
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Cambiar el color de fondo de la cabecera a verde
                    using (var headerCells = worksheet.Cells[4, 1, 4, dataArray.GetLength(1)]) // Nota que aquí también se ha ajustado para que la cabecera esté en la fila 4
                    {
                        headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        headerCells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(119, 241, 168));
                        headerCells.Style.Font.Color.SetColor(System.Drawing.Color.Black);
                        headerCells.Style.Font.Bold = true;
                    }
                    //worksheet.InsertColumn(23, 4);
                    // Combinando celdas y aplicando estilos en la fila 1 y 2
                    worksheet.Cells["C1:F1"].Merge = true;
                    worksheet.Cells["C2:F2"].Merge = true;
                    worksheet.Cells["G1:J1"].Merge = true;
                    worksheet.Cells["G2:J2"].Merge = true;

                    // Configuración de estilo para las celdas combinadas
                    // Combinando los bloques de celdas y aplicando estilos
                    worksheet.Cells["C1:F2"].Merge = true;  // Combinando C1, D1, E1, F1, C2, D2, E2, F2 en una celda
                    worksheet.Cells["G1:J2"].Merge = true;  // Combinando G1, H1, I1, J1, G2, H2, I2, J2 en una celda

                    //obtenes el nombre de la primera fila.
                    string nombreSucursal = dataArray[1, 0].ToString();
                    // Configuración de estilo y asignación de valores para las celdas combinadas
                    var headerConfigurations = new List<(string Range, string Value)>
                    {
                         ("C1:F2", "LOCAL"),
                         ("G1:J2", nombreSucursal)
                    };

                    foreach (var config in headerConfigurations)
                    {
                        var cells = worksheet.Cells[config.Range];
                        cells.Value = config.Value;
                        cells.Style.Font.Size = 22;
                        cells.Style.Font.Bold = true;
                        cells.Style.Font.Name = "Calibri";
                        cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; // Centrar texto
                        cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center; // Centrar texto verticalmente
                         
                        // Aplicar el color de fondo
                        cells.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        cells.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(119, 241, 168));

                    }

                    // AHORA TRABAJAREMOS LA LINEA 3 DEL EXCEL Y DARLES LOS FORMATOS NECESARIOS

                    foreach (var col in new[] { "C", "D", "E", "F", "K", "L", "S", "V", "AA", "AB" })
                    {
                        worksheet.Cells[$"{col}3:{col}4"].Merge = true;
                    }

                    worksheet.Cells["G3:J3"].Merge = true;
                    worksheet.Cells["T3:U3"].Merge = true;
                    worksheet.Cells["W3:Z3"].Merge = true;

                    // Asignamos valores a las celdas
                    worksheet.Cells["C3"].Value = "FECHA DE VENTA";
                    worksheet.Cells["D3"].Value = "TOTAL VENTAS";
                    worksheet.Cells["E3"].Value = "VENTA AL CREDITO";
                    worksheet.Cells["F3"].Value = "VENTA CON TARJETA";
                    worksheet.Cells["K3"].Value = "VENTA EN EFECTIVO";
                    worksheet.Cells["L3"].Value = "FECHA DE DEPOSITO - EFECTIVO";
                    worksheet.Cells["S3"].Value = "TOTAL DEPOSITOS";
                    worksheet.Cells["V3"].Value = "DIFERENCIA CON DEPOSITO";
                    worksheet.Cells["AA3"].Value = "ENCARGADO DE LOCAL";
                    worksheet.Cells["AB3"].Value = "OBSERVACION";
                    worksheet.Cells["G3"].Value = "TIPO TARJETA";
                    worksheet.Cells["T3"].Value = "NOTAS DE CREDITO";
                    worksheet.Cells["W3"].Value = "CAJERO";

                    //NUEVOS ESTILOS PARA LA FILA 3
                    worksheet.Cells["M3"].Value = "DEPOSITO AL BANCO-EFECTIVO";
                    worksheet.Cells["N3"].Value = "TRANSFERENCIA DE DEPÓSITOS- CLIENTES";
                    worksheet.Cells["O3"].Value = "TRANSFERENCIA YAPE";
                    worksheet.Cells["P3"].Value = "TRANSFERENCIA PLIN";
                    worksheet.Cells["Q3"].Value = "PAGO MEDIANTE QR";
                    worksheet.Cells["R3"].Value = "PAGO MEDIANTE  LINK DE PAGO";

                    // Asignar los valores a las celdas en la fila 4
                    worksheet.Cells["G4"].Value = "VISA";
                    worksheet.Cells["H4"].Value = "MASTERCARD";
                    worksheet.Cells["I4"].Value = "DINERS CLUB";
                    worksheet.Cells["J4"].Value = "AMERICAN EXPRESS";
                    worksheet.Cells["M4"].Value = "MONTO";
                    worksheet.Cells["N4"].Value = "Monto";
                    worksheet.Cells["O4"].Value = "Monto";
                    worksheet.Cells["P4"].Value = "Monto";
                    worksheet.Cells["Q4"].Value = "Monto";
                    worksheet.Cells["R4"].Value = "Monto";
                    worksheet.Cells["T4"].Value = "Nº del comprobante de pago";
                    worksheet.Cells["U4"].Value = "Monto";

                    // Configuramos tipo de letra, tamaño y color para las filas 3 y 4
                    var fontColor = System.Drawing.Color.FromArgb(119, 241, 168);
                    foreach (var col in new[] { "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB" })
                    {
                        for (int row = 3; row <= 4; row++)
                        {
                            var cell = worksheet.Cells[$"{col}{row}"];
                            cell.Style.Font.Name = "Calibri";
                            cell.Style.Font.Size = 10;
                            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(fontColor);
                            cell.Style.Font.Bold = true;
                            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        }
                    }
                    foreach (var cellAddress in new[] { "A4", "B3", "B4" })
                    {
                        var cell = worksheet.Cells[cellAddress];
                        cell.Style.Font.Name = "Calibri";
                        cell.Style.Font.Size = 10;
                        cell.Style.Font.Bold = true;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                        // Quitar el color de fondo (opcional, ya que por defecto no debería tener color)
                        cell.Style.Fill.PatternType = ExcelFillStyle.None;
                    }

                    // Establecer el número de filas con datos, en este caso sera un for
                    int numberOfRowsWithData = dataArray.GetLength(0);

                    // Diccionario que mapea la columna donde se establece las formulas, se hizo asi para que el codigo no sea extenso o tambien se puede usar
                    //for (int i = 2; i <= numberOfRowsWithData; i++)
                    //{
                    //    var cell = worksheet.Cells[i, 6]; // Columna F
                    //    cell.Formula = $"SUM(G{i}:J{i})";
                    //    cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //    cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(119, 241, 168));

                    //}

                   //ESTO SE USARIA PARA CASOS ESPECIFICOS
                        Dictionary<int, string> columnFormulas = new Dictionary<int, string>
                     {
                             { 6, "SUM(G{0}:J{0})" },  // SE USA PARA EL NUMERO DEFILA 6=F SE CUENTA Y ASI PARA LOS DEMAS
                             { 11, "D{0}-(E{0}+F{0})" },
                             { 19, "SUM(M{0},N{0},O{0},P{0},Q{0},R{0})" },
                             { 22, "SUM(S{0},U{0})-K{0}" }
                        };

                    // Recorrer las entradas en el diccionario y aplicar las fórmulas y estilos
                    foreach (var entry in columnFormulas)
                    {
                        int columnIndex = entry.Key;
                        string formulaPattern = entry.Value;

                        for (int i = 5; i <= numberOfRowsWithData + 3; i++) // Se ajusta aquí sumando 3
                        {
                            var cell = worksheet.Cells[i, columnIndex];
                            cell.Formula = string.Format(formulaPattern, i);
                            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(119, 241, 168));
                        }
                    }

                    int totalRow = dataArray.GetLength(0) + 4; // Se ajusta aquí sumando 3

                    // Agregar "TOTAL" en la columna C 
                    var totalCell = worksheet.Cells[totalRow, 3];
                    totalCell.Value = "TOTAL";
                    totalCell.Style.Font.Bold = true; // se uso para hacerle negrita

                    // Columnas a ignorar para la suma total
                    HashSet<int> columnsToIgnore = new HashSet<int> { 1, 2, 3, 12, 17, 18, 20, 27, 28 };

                    // Agregar la suma para cada columna desde la línea 5 hasta el final de los datos
                    for (int col = 1; col <= dataArray.GetLength(1); col++)
                    {
                        if (!columnsToIgnore.Contains(col))
                        {
                            var cell = worksheet.Cells[totalRow, col];
                            cell.Formula = $"SUM({cell.Address[0]}5:{cell.Address[0]}{totalRow - 1})"; // Se ajusta aquí a línea 5
                            cell.Style.Font.Bold = true;
                        }
                    }
                    // Aplicar formato de dos decimales a las celdas de datos (desde la fila 5 hasta la fila totalRow - 1).
                    for (int row = 5; row < totalRow; row++)
                    {
                        for (int col = 1; col <= dataArray.GetLength(1); col++)
                        {
                            if (!columnsToIgnore.Contains(col))
                            {
                                var cell = worksheet.Cells[row, col];
                                cell.Style.Numberformat.Format = "0.00";
                            }
                        }
                    }

                    // Aplicar formato de dos decimales a las celdas de la fila totalRow que contienen las sumas.
                    for (int col = 1; col <= dataArray.GetLength(1); col++)
                    {
                        if (!columnsToIgnore.Contains(col))
                        {
                            var cell = worksheet.Cells[totalRow, col];
                            cell.Style.Numberformat.Format = "0.00";
                        }
                    }
                    //FORMATO DE SOLES 
                    // Aplicar formato de moneda a las celdas de la columna M (desde la fila 5 hasta la fila totalRow - 1).
                    for (int row = 5; row < totalRow; row++)
                    {
                        var cell = worksheet.Cells[row, 13]; // 13 es la columna M en Excel.
                        cell.Style.Numberformat.Format = "\"S/.\" #,##0.00";
                    }

                    // Aplicar formato de moneda a la celda de la fila totalRow en la columna M.
                    var totalCellInM = worksheet.Cells[totalRow, 13];
                    totalCellInM.Style.Numberformat.Format = "\"S/.\" #,##0.00";

                    // lo que aca se hace es que se coloca los bordes
                    // Este código aplica bordes desde la columna 3 hasta la columna "AB" para cada fila
                    // Formato para filas 1 y 2, sólo de C a J.
                    for (int row = 1; row <= 2; row++)
                    {
                        for (int col = 3; col <= 10; col++) // 3 corresponde a la columna C y 10 corresponde a la columna J en Excel.
                        {
                            var cell = worksheet.Cells[row, col];

                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                            cell.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                        }
                    }

                    // Formato para las demás filas, desde la columna 3 (C) hasta la columna 28 (AB).
                    for (int row = 3; row <= totalRow; row++)
                    {
                        for (int col = 3; col <= 28; col++) // 3 corresponde a la columna C y 28 corresponde a la columna AB en Excel.
                        {
                            var cell = worksheet.Cells[row, col];

                            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                            cell.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                            cell.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                        }
                    }

                    // SE CENTRARA LOS DATOS DEL EXCEL.
                    // Iterar a través de las filas de datos, excluyendo las filas 1, 2, 3, 4 y totalRow
                    for (int row = 5; row <= totalRow; row++)
                    {
                        for (int col = 3; col <= 28; col++) // 3 corresponde a la columna C y 28 a la columna AB en Excel.
                        {
                            var cell = worksheet.Cells[row, col];

                            // Si estamos en la celda donde está el valor "TOTAL", saltamos a la siguiente iteración.
                            if (row == totalRow && col == 3) continue;

                            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        }
                    }

                    for (int col = 1; col <= 28; col++)
                    {
                        worksheet.Cells[3, col].Style.WrapText = true; // Ajuste automático para la fila 3
                        worksheet.Cells[4, col].Style.WrapText = true; // Ajuste automático para la fila 4
                    }
                    // Ajustando el ancho de columnas específicas
                    worksheet.Column(4).Width = 10.20;    // g
                    worksheet.Column(7).Width = 10.78;    // g
                    worksheet.Column(8).Width = 10.78;    // h
                    worksheet.Column(9).Width = 10.78;    // i
                    worksheet.Column(10).Width = 10.78;   // j
                    worksheet.Column(11).Width = 10.00;   // j
                    worksheet.Column(12).Width = 16.00;   // l
                    worksheet.Column(13).Width = 14.80;   // m
                    worksheet.Column(14).Width = 18.56;   // n
                    worksheet.Column(15).Width = 15.30;  // o
                    worksheet.Column(16).Width = 15.30;  // p
                    worksheet.Column(17).Width = 12.44;  // q
                    worksheet.Column(18).Width = 15.35;  // r
                    worksheet.Column(19).Width = 11.90;   // s
                    worksheet.Column(20).Width = 13.22;   // t
                    worksheet.Column(21).Width = 8.33;    // u
                    worksheet.Column(22).Width = 11.45;    // V
                    worksheet.Column(23).Width = 7.15;    // w
                    worksheet.Column(24).Width = 7.15;    // x
                    worksheet.Column(25).Width = 7.15;    // y
                    worksheet.Column(26).Width = 7.15;    // z
                    worksheet.Column(27).Width = 13.25;   // aa
                    worksheet.Column(28).Width = 141.70;  // ab
                    // AHORA LE DAREMOS UN TAMAÑO A LA FILA  3
                    worksheet.Row(3).Height = 29.6;
                    //FORMATO ALA TABLA SOLITARIA
                    int startSummaryRow = totalRow + 4; // 3 líneas de espacio después del "TOTAL"

                    // Estableciendo los títulos del resumen
                    string[] titles = {
                            "RESUMEN",
                            "VENTA TOTAL",
                            "VENTA CON TARJETA",
                            "DEPOSITOS EFECTIVO",
                            "TRANSFERENCIAS DEL CLIENTES",
                            "MONTO DE NOTAS DE CREDITO",
                            "SALDOS A COBRAR A CLIENTES"
                              };

                    for (int i = 0; i < titles.Length; i++)
                    {
                        if (i == 0)
                        {
                            worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 12].Merge = true;
                        }
                        else
                        {
                            worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 11].Merge = true;
                        }
                        worksheet.Cells[startSummaryRow + i, 8].Value = titles[i];
                    }

                    // Aplicando las fórmulas en la columna L
                    worksheet.Cells[startSummaryRow + 1, 12].Formula = $"D{totalRow}";
                    worksheet.Cells[startSummaryRow + 2, 12].Formula = $"F{totalRow}";
                    worksheet.Cells[startSummaryRow + 3, 12].Formula = $"M{totalRow}";
                    worksheet.Cells[startSummaryRow + 4, 12].Formula = $"=N{totalRow}+O{totalRow}+P{totalRow}+Q{totalRow}+R{totalRow}";
                    worksheet.Cells[startSummaryRow + 5, 12].Value = 0;
                    worksheet.Cells[startSummaryRow + 6, 12].Formula = $"=L{startSummaryRow + 1}-L{startSummaryRow + 2}-L{startSummaryRow + 3}-L{startSummaryRow + 4}-L{startSummaryRow + 5}";

                    // Ajuste opcional de formato (negrita, alineación, etc.).
                    for (int i = 0; i < titles.Length; i++)
                    {
                        if (i == 0) // Para el título "RESUMEN"
                        {
                            worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 12].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 12].Style.Font.Bold = true;
                        }
                        else // Para los demás títulos
                        {
                            /* worksheet.Cells[startSummaryRow + i, 12].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; */// Solo centrando resultados en columna L
                            worksheet.Cells[startSummaryRow + i, 12].Style.Font.Bold = false;
                            worksheet.Cells[startSummaryRow + i, 8].Style.Font.Bold = true;
                        }
                    }
                    // Aplicar formato de dos decimales a celdas con fórmulas
                    for (int i = 1; i < titles.Length; i++) // Empezando desde 1 porque no queremos considerar el título "RESUMEN"
                    {
                        var cell = worksheet.Cells[startSummaryRow + i, 12];

                        // Verificar si la celda tiene una fórmula
                        if (!string.IsNullOrEmpty(cell.Formula))
                        {
                            cell.Style.Numberformat.Format = "0.00"; // Aplicar formato de dos decimales
                        }
                    }
                    // Función auxiliar para agregar bordes a una celda
                    void SetBorders(ExcelRange cell)
                    {
                        cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }

                    for (int i = 0; i < titles.Length; i++)
                    {
                        if (i == 0)
                        {
                            var mergedCell = worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 12];
                            SetBorders(mergedCell);
                            mergedCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                            mergedCell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(119, 241, 168)); // Color para "RESUMEN"
                        }
                        else
                        {
                            SetBorders(worksheet.Cells[startSummaryRow + i, 8, startSummaryRow + i, 11]);
                            SetBorders(worksheet.Cells[startSummaryRow + i, 12]);
                        }
                    }


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


        //-----------FIN CODIGO YEX---------------------------

    }
}
