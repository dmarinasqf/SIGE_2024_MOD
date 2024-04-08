using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.DAO
{
    public  class ReporteVentasDao
    {
        private readonly string cadena;
        
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private static DataTable tabla;


        public ReporteVentasDao(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetReporteIncentivos(string numdocumento,string fechainicio,string fechafin, int top)
        {
            try
            {

                tabla = new DataTable();
                numdocumento = numdocumento ?? "";
                fechainicio = fechainicio ?? "";
                fechafin = fechafin ?? "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.sp_reporte_incentivos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@numdocumento", numdocumento);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@top", top);
                
                
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "INCENTIVOS";
                cnn.Close();
                
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelIncentivosAsync(string numdocumento, string fechainicio, string fechafin, int top, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    //var DATA =  GetReporteIncentivos(numdocumento, fechainicio, fechafin, top);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteincentivos" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, tabla);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<DataTable> GetReporteVentas(int top, string sucursal, string fechainicio, string fechafin,string cliente, string tipoplantilla,string documentos)
        {
            var tarea = await Task.Run(() =>
            {
                
                try
                {
                    tabla = new DataTable();
                    //agregar la columna de cantidad en el reporte y en la tabla de js
                    if (top is 0) top = 10;
                    if (fechafin is null) fechafin = "";
                    if (fechainicio is null) fechainicio = "";
                    if(cliente is null) cliente="";
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.sp_reporte_ventas", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@fechafin", fechafin);
                    cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                    cmm.Parameters.AddWithValue("@idsucursal", sucursal);
                    cmm.Parameters.AddWithValue("@cliente", cliente ?? "");
                    cmm.Parameters.AddWithValue("@documentos", documentos ?? "");
                    cmm.Parameters.AddWithValue("@tipoplantilla", tipoplantilla ?? "plantilla1");
                    cmm.Parameters.AddWithValue("@top", top);
                    cmm.CommandTimeout = 0;
                    
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "REPORTE VENTAS";
                    cnn.Close();
                    return tabla;
                }
                catch (Exception e)
                {
                    return new DataTable();
                }
            });
            return tarea;
        }
        public  DataTable GettbTemp(string tb)
        {
            if (tb.Contains("1"))
            {
                tb = "TbTemp1";
            }
            else{
                tb = "TbTemp2";
            }
             DataTable dt = new DataTable();
            try
            {
                SqlDataReader leer;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                SqlCommand cmd = new SqlCommand("select * from "+tb, cnn);
                
                leer = cmd.ExecuteReader();
                dt.Load(leer);
                cnn.Close();
            }
            catch (Exception e)
            {

                dt = null;
            }
            return dt;
        }
        public async Task<mensajeJson> GenerarExcelReporteVentas(int top, string sucursal, string fechainicio, string fechafin,string cliente, string tipoplantilla,string documentos, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    //var DATA = await GetReporteVentas(top,sucursal,fechainicio, fechafin,cliente,tipoplantilla, documentos);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteventas" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";
                    //DataTable dt= GettbTemp(tipoplantilla);
                    //dt.TableName=("REPORTE VENTAS");
                    
                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res;
                    if (tabla is null)
                    {
                        var DATA = await GetReporteVentas(top, sucursal, fechainicio, fechafin, cliente, tipoplantilla, documentos);
                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else
                    {
                        res = save.GenerateExcel(ruta, nombre, tabla);
                    }
                    
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
    }
}
