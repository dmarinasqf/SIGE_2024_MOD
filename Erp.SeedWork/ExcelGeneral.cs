using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;


namespace Erp.SeedWork
{
    public class ExcelGeneral
    {
        private XLWorkbook _workbook;
       

        public String guardarExcel(String path, DataTable tabla)
        {
            _workbook = new XLWorkbook();
            _workbook.AddWorksheet(tabla);
            try
            {
                _workbook.SaveAs(path);
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
        public String guardarExcelConPresentacion(String path, DataTable tabla, string presentacion, string fechas)
        {

            try
            {
                _workbook = new XLWorkbook();
                IXLWorksheet ws = _workbook.Worksheets.Add("LIBRO");
                //Ponemos algunos valores en el documento
                _workbook.Worksheets.Worksheet(1).Cell("B1").Value = presentacion;
                _workbook.Worksheets.Worksheet(1).Cell("B2").Value = fechas;

                //Podemos insertar un DataTable
                _workbook.Worksheets.Worksheet(1).Cell(4, 1).InsertTable(tabla);
                //Aplicamos los filtros y formatos a la tabla 
                _workbook.Worksheets.Worksheet(1).Table("Table1").ShowAutoFilter = true;
                _workbook.Worksheets.Worksheet(1).Table("Table1").Style.Alignment.Vertical =
                    XLAlignmentVerticalValues.Center;
                _workbook.Worksheets.Worksheet(1).Columns().AdjustToContents();

                _workbook.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.Style.Font.Bold = true;
                var rango = ws.Range("B1:B2");
                rango.Style.Font.FontSize = 14;
                rango.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.SaveAs(path);
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
        public string guardarVariosLibros(string path, List<DataTable> datos)
        {
            try
            {
                _workbook = new XLWorkbook();
                foreach (var item in datos)
                {
                    _workbook.AddWorksheet(item);
                }
                _workbook.SaveAs(path);
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
        public String guardarExcelProformaPresentacion(String path, DataTable tabla, string presentacion, string fechas)
        {

            try
            {
                _workbook = new XLWorkbook();
                IXLWorksheet ws = _workbook.Worksheets.Add("LIBRO");
                //Ponemos algunos valores en el documento
                _workbook.Worksheets.Worksheet(1).Cell("B1").Value = presentacion;
                _workbook.Worksheets.Worksheet(1).Cell("B2").Value = fechas;

                //Podemos insertar un DataTable
                _workbook.Worksheets.Worksheet(1).Cell(4, 1).InsertTable(tabla);
                //Aplicamos los filtros y formatos a la tabla 
                _workbook.Worksheets.Worksheet(1).Table("Table1").ShowAutoFilter = true;
                _workbook.Worksheets.Worksheet(1).Table("Table1").Style.Alignment.Vertical =
                    XLAlignmentVerticalValues.Center;
                _workbook.Worksheets.Worksheet(1).Columns().AdjustToContents();

                _workbook.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.Style.Font.Bold = true;
                var rango = ws.Range("B1:B2");
                rango.Style.Font.FontSize = 14;
                rango.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.SaveAs(path);
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
    }

}
