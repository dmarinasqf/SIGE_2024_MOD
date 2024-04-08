using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.DAO
{
   public class ReporteDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;
        public static DataTable dtventasvscompras;
        public static DataTable dtventas;
        public static DataTable dtcompras;

        public ReporteDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable ReportVentasvsCompras(string fechai,string fechaf) {

            try {
                dtventasvscompras = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_VENTAS_VS_COMPRAS_RANGO_FECHAS_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtventasvscompras);
                dtventasvscompras.TableName = "ventas vs compras";
                cnn.Close();
                return dtventasvscompras;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelVentasvsComprasAsync(string fechainicio, string fechafin,string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteventasvscompras" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtventasvscompras is null) {
                        var DATA =  ReportVentasvsCompras(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtventasvscompras);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteVentas(string fechai, string fechaf) {

            try {
                dtventas = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_VENTAS_RANGO_FECHAS_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtventas);
                dtventas.TableName = "VENTAS";
                cnn.Close();
                return dtventas;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelVentasAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteventas" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtventas is null) {
                        var DATA = ReporteVentas(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtventas);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteCompras(string fechai, string fechaf) {

            try {
                dtcompras = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_COMPRAS_RANGO_FECHAS_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtcompras);
                dtcompras.TableName = "Compras";
                cnn.Close();
                return dtcompras;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelComprasAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportecompras" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtcompras is null) {
                        var DATA = ReporteCompras(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtcompras);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
    }
}
