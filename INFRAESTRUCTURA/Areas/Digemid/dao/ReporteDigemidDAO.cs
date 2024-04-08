using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Digemid.dao
{
    public class ReporteDigemidDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public ReporteDigemidDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetMaestroMensual(string fechainicio , string fechafin, string sucursal, string empresa, bool iscovid,int top, int lista)
        {
            try
            {
                fechainicio = fechainicio ?? "";
                fechafin = fechafin ?? "";
                sucursal = sucursal ?? "";
                empresa = empresa ?? "";
                if (top is 0) top = 1000;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Digemid.sp_reporte_maestro_mensual_digemid", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                cmm.Parameters.AddWithValue("@empresa", empresa);
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@covid", iscovid);
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@idlista", lista);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "MAESTRO";
                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> ExcelMaestroMensual(string fechainicio, string fechafin, string sucursal, string empresa, bool iscovid, int top,int lista, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    var DATA = GetMaestroMensual(fechainicio, fechafin, sucursal, empresa,iscovid, top,lista);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportemensual" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/digemid/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
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
        public DataTable GetPreciosMensual( int sucursal, int lista, string tipo)
        {
            try
            {
                tipo = tipo ?? "farmacias";              
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Digemid.sp_reporte_precios_mensual_digemid", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
            
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@idlista", lista);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "Hoja1";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> ExcelPreciosMensual(int sucursal, int lista, string tipo, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    var DATA = GetPreciosMensual(  sucursal, lista,tipo);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = $"{sucursal}_{tipo}_preciosmensual"+ DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/digemid/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
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
        public DataTable GetPreciosCovid(int sucursal, int lista, string tipo,string fechainicio, string fechafin)
        {
            try
            {
                tipo = tipo ?? "farmacias";
                fechainicio = fechainicio ?? "";
                fechafin = fechafin ?? "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Digemid.sp_reporte_precios_covid", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@idlista", lista);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "Hoja1";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> ExcelPreciosCovid(int sucursal, int lista, string tipo, string fechainicio, string fechafin, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    var DATA = GetPreciosCovid(sucursal, lista, tipo,fechainicio,fechafin);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = $"{sucursal}_{tipo}_precioscovid" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/digemid/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
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
