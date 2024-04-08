using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.SeedWork
{
    public class GuardarElementos
    {
        private XLWorkbook _workbook;
        public string SaveFile(IFormFile file, string direccion,string fileName)
        {
            try
            {
                direccion = CrearDirectorio(direccion);
                string filePath = Path.GetFullPath(Path.Combine(direccion));
                string path = Path.Combine(direccion, fileName);
                //5 copy the file to the path
                using (var fileStream = new FileStream(Path.Combine(filePath, fileName), FileMode.Create))
                {
                    file.CopyTo(fileStream);
                }
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;                
            }
           
        }

        public string GenerateExcel(string path, string nombre, DataTable tabla)
        {
            path = CrearDirectorio(path);
            _workbook = new XLWorkbook();
            _workbook.AddWorksheet(tabla);
            _workbook.Worksheets.Worksheet(1).Columns().AdjustToContents();
            try
            {
                _workbook.SaveAs(path + nombre);
                //aca cambiar de el boton exportar
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
        public byte[] GenerateExcelByte(DataTable tabla)
        {
         
            _workbook = new XLWorkbook();
            _workbook.AddWorksheet(tabla);
            _workbook.Worksheets.Worksheet(1).Columns().AdjustToContents();
            var workbookBytes = new byte[0];
            using (var ms = new MemoryStream())
            {
                _workbook.SaveAs(ms);
                workbookBytes = ms.ToArray();
            }
            return workbookBytes;
        }
        public string GenerarExcelConPresentacion(string path,string nombre, DataTable tabla, string presentacion, string fechas)
        {

            try
            {
                path = CrearDirectorio(path);
                _workbook = new XLWorkbook();
                IXLWorksheet ws = _workbook.Worksheets.Add("LIBRO");
              
                _workbook.Worksheets.Worksheet(1).Cell("B1").Value = presentacion;
                _workbook.Worksheets.Worksheet(1).Cell("B2").Value = fechas;
                _workbook.Worksheets.Worksheet(1).Cell(4, 1).InsertTable(tabla);               
               
                _workbook.Worksheets.Worksheet(1).Columns().AdjustToContents();

                _workbook.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.Style.Font.Bold = true;
                var rango = ws.Range("B1:B2");
                rango.Style.Font.FontSize = 14;
                rango.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                _workbook.SaveAs(path+nombre);
                return "ok";
            }
            catch (Exception e)
            {

                return (e.Message);
            }
        }
        public string CrearDirectorio(string path)
        {
            try
            {
                if (Directory.Exists(path))
                {
                    return path;
                }
                DirectoryInfo di = Directory.CreateDirectory(path);
                return path;
                //di.Delete();                    
            }
            catch (Exception)
            {
                return "x";
            }
        }
        public async Task<string> SaveFileBase64(string file, string direccion, string fileName)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    var extension = "";
                    var block = file.Split(",");
                    var realdata = block[1];
                    var contentType = block[0].Split(":")[1].Replace(";base64","");
                    if (contentType.Contains("image"))
                        extension = ".png";
                    //file = file.Replace("data:image/png;base64,", String.Empty);
                  
                    byte[] data = Convert.FromBase64String(realdata);
                    fileName = fileName + extension;
                    direccion = CrearDirectorio(direccion);                    
                    string path = Path.Combine(direccion, fileName);
                    System.IO.File.WriteAllBytes(path, data);
                    return fileName;
                }
                catch (Exception )
                {
                    return "x";
                }

            });
            return tarea;
        }
        public  string creartxt(string path, string valor, string nombre)
        {
            try
            {
                //var folder = path + "/horizonte/txt";
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                string filePath = Path.Combine(path, nombre);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
                var bytes = Encoding.UTF8.GetBytes(valor);
                FileStream stream = new FileStream(filePath, FileMode.CreateNew);
                BinaryWriter writer = new BinaryWriter(stream);
                writer.Write(bytes, 0, bytes.Length);
                writer.Close();
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }

        }
    }
}
