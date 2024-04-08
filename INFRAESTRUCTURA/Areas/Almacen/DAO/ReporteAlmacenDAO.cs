using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class ReporteAlmacenDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private static DataTable dtanalisis;
        private static DataTable dtesencial;
        private static DataTable dtstock;
        private static DataTable dtguiastransferencias;
        private static DataTable dtreporteguias;

        public ReporteAlmacenDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable ReporteStock(string producto, string sucursal, int top, string laboratorio, string almacen)
        {
            try
            {
                if (producto is null) producto = "";
                if (top is 0) top = 100;
                if (sucursal is null) sucursal = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("almacen.SP_REPORTE_STOCK", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@producto", producto);
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio ?? "");
                cmm.Parameters.AddWithValue("@almacen", almacen ?? "");

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTOS";
                dtstock = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> ReporteAnalisisStockasync(string alerta, string sucursal, string laboratorio, int idempresa)
        {
            try
            {
                var data = ReporteAnalisisStock(alerta, sucursal, laboratorio, idempresa);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public DataTable ReporteAnalisisStock(string alerta, string sucursal, string laboratorio, int idempresa)
        {
            try
            {
                DataTable dt = new DataTable();
                DateTime date = DateTime.Now;
                List<String> listameses = new List<string>();
                for (int i = 0; i < 4; i++)
                {
                    DateTime ndate = date.AddMonths(-i);
                    string mes = ndate.ToString("MMMM");
                    mes = (mes.Substring(0, 3)).ToUpper();
                    listameses.Add(mes);
                }
                dtanalisis = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //10
                cmm = new SqlCommand("almacen.SP_REPORTE_ANALISIS_STOCK", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@idempresa", idempresa);
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio);
                cmm.CommandTimeout = 32767;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ANALISIS STOCK";

                for (int i = 0; i < 4; i++)
                {
                    int a = 13;
                    tabla.Columns[a - i].ColumnName = listameses[i].ToString();
                }
                tabla.AcceptChanges();
                foreach (DataRow row in tabla.Rows)
                {

                    int val1 = (Convert.ToInt32(row[10].ToString()));
                    int val2 = (Convert.ToInt32(row[11].ToString()));
                    int val3 = (Convert.ToInt32(row[12].ToString()));
                    int div = 0;
                    int result = 0;
                    if (val1 > 0) div++;
                    if (val2 > 0) div++;
                    if (val3 > 0) div++;
                    if (div > 0) result = (val1 + val2 + val3) / div;
                    row[14] = result.ToString();
                }
                foreach (DataRow row in tabla.Rows)
                {
                    int prom = 0;
                    int stock = 0;
                    string result = "NO";
                    prom = (Convert.ToInt32(row[14].ToString()));
                    stock = (Convert.ToInt32(row[15].ToString()));
                    if (prom > 0)
                    {
                        if (prom > stock)
                        {
                            result = "SI";
                        }
                    }
                    row[5] = result;
                }

                dt = tabla.Clone();
                foreach (DataRow row in tabla.Rows)
                {
                    if (alerta == "0")
                    {
                        //dt.Rows.Add(row);
                        dt.ImportRow(row);
                    }
                    if (alerta == "1")
                    {
                        if (row[5].ToString() == "SI")
                        {
                            dt.ImportRow(row);
                        }
                    }
                    if (alerta == "2")
                    {
                        if (row[5].ToString() == "NO")
                        {
                            dt.ImportRow(row);
                        }
                    }
                }

                //4 13 14


                dtanalisis = dt;
                cnn.Close();
                return dt;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> GenerarExcelStockAsync(string producto, string sucursal, int top, string laboratorio, string almacen, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtstock;//ReporteStock(producto,sucursal,top,laboratorio);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportestock" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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

        public DataTable ReporteEsencial(string sucursal, string laboratorio, int idempresa)
        {
            try
            {
                DataTable dt = new DataTable();
                DateTime date = DateTime.Now;

                List<String> listameses = new List<string>();
                for (int i = 0; i < 4; i++)
                {
                    DateTime ndate = date.AddMonths(-i);
                    string mes = ndate.ToString("MMMM");
                    mes = (mes.Substring(0, 3)).ToUpper();
                    listameses.Add(mes);
                }
                dtanalisis = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //10
                cmm = new SqlCommand("almacen.SP_REPORTE_ANALISIS_ESENCIAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@idempresa", idempresa);
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "REPORTE ESENCIAL";

                for (int i = 0; i < 4; i++)
                {
                    int a = 12;
                    tabla.Columns[a - i].ColumnName = listameses[i].ToString();
                }
                tabla.AcceptChanges();
                foreach (DataRow row in tabla.Rows)
                {

                    int val1 = (Convert.ToInt32(row[9].ToString()));
                    int val2 = (Convert.ToInt32(row[10].ToString()));
                    int val3 = (Convert.ToInt32(row[11].ToString()));
                    int div = 0;
                    int result = 0;
                    if (val1 > 0) div++;
                    if (val2 > 0) div++;
                    if (val3 > 0) div++;
                    if (div > 0) result = (val1 + val2 + val3) / div;
                    row[13] = result.ToString();
                }
                foreach (DataRow row in tabla.Rows)
                {
                    int prom = 0;
                    int stock = 0;
                    string result = "NO";
                    prom = (Convert.ToInt32(row[13].ToString()));
                    stock = (Convert.ToInt32(row[14].ToString()));
                    if (prom > 0)
                    {
                        if (prom > stock)
                        {
                            result = "SI";
                        }
                    }
                    row[4] = result;
                }

                dtesencial = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }

        public DataTable Totalstock(int producto)
        {

            DataTable dt = new DataTable();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("Ventas.Total_stock", cnn);
            cmm.CommandType = CommandType.StoredProcedure;
            cmm.Parameters.AddWithValue("@idproducto", producto);
            SqlDataAdapter da = new SqlDataAdapter(cmm);
            da.Fill(dt);
            cnn.Close();
            return dt;
        }

        public DataTable ReporteKardex(int producto, int almacen, int top, string fechainicio, string fechafin)
        {
            try
            {
                if (fechainicio is null) fechainicio = "";
                if (top is 0) top = 100;
                if (fechafin is null) fechafin = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("almacen.SP_REPORTE_KARDEX", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", producto);
                cmm.Parameters.AddWithValue("@idalmacen", almacen);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                cmm.Parameters.AddWithValue("@top", top);
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "REPORTE KARDEX";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable ReporteVentasVsCompras(int producto, string fechainicio)
        {
            try
            {

                if (fechainicio is null) fechainicio = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //CAMBIOS SEMANA3
                cmm = new SqlCommand("almacen.sp_ventasvscompras_xproducto_v2", cnn);
                //cmm = new SqlCommand("almacen.sp_ventasvscompras_xproducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", producto);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                //foreach (DataRow row in tabla.Rows) { }


                tabla.TableName = "VENTAS VS COMPRAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception vEx)
            {
                return new DataTable();
            }

        }
        public DataTable ReporteVentasMensualesXproducto(int producto, int anno)
        {
            try
            {
                if (anno is 0) anno = DateTime.Now.Year;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //string proc = "ventas.sp_get_ventasmensuales_xproducto";
                //string proc = "ventas.sp_get_ventasmensuales_xproducto_new";
                //CAMBIOS SEMANA3
                string proc = "ventas.sp_get_ventasmensuales_xproducto_v3";
                cmm = new SqlCommand(proc, cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", producto);
                cmm.Parameters.AddWithValue("@anno", anno);
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();

                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                //foreach (DataRow row in tabla.Rows) { }
                tabla.TableName = "VENTAS VS COMPRAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable BuscarUltimos10ConsumoEconomato(int idproducto)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.BuscarUltimos10ConsumoEconomato_PorProducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CONSUMO ECONOMATO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public int getmultiploxproducto(int producto)
        {
            int multiplo = 1;
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("sp_getproducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", producto);

                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();

                DataSet set = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(cmm);
                adapter.Fill(set);
                foreach (DataRow item in set.Tables[0].Rows)
                {
                    multiplo = Convert.ToInt32(item["multiplo"]);
                }
                //foreach (DataRow row in tabla.Rows) { }
                cnn.Close();
                return multiplo;
            }
            catch (Exception e)
            {
                return multiplo;
            }

        }
        public async Task<mensajeJson> GenerarExcelKardexAsync(int producto, int almacen, int top, string fechainicio, string fechafin, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = ReporteKardex(producto, almacen, top, fechainicio, fechafin);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportekardex" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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
        public async Task<mensajeJson> GenerarExcelAnalisisStock(int sucursal, int idempresa, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtanalisis;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Analisis_Stock" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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
        public async Task<mensajeJson> GenerarExcelEsencial(int sucursal, int idempresa, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtesencial;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Esencial" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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


        //----------------------------------------
        ///EARTC10000
        public DataTable GuiasTransferencias(string codigo, string estado, string tipo, string idempresa)
        {
            try
            {
                DataTable dt = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_REPORTE_GUIAS_TRANSFERENCIAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@ESTADO_GUIA", estado);
                cmm.Parameters.AddWithValue("@TIPO", tipo);
                cmm.Parameters.AddWithValue("@IDEMPRESA", idempresa);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dt);
                dt.TableName = "REPORTE GUIAS Y TRANSFERENCIAS";
                dtguiastransferencias = dt;
                cnn.Close();
                return dt;
            }
            catch (Exception)
            {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelGuiasTransferencias(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtguiastransferencias;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "GuiasTransferencias" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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

        //----------------------------------------
        ///EARTC10001
        public DataTable ReporteGuias(int sucursalorigen, int sucursaldestino, string numdocumento)
        {
            try
            {
                DataTable dt = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_REPORTE_GUIAS_POR_SUCURSAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@SUCURSAL_ORIGEN", sucursalorigen);
                cmm.Parameters.AddWithValue("@SUCURSAL_DESTINO", sucursaldestino);
                cmm.Parameters.AddWithValue("@NUM_DOCUMENTO", numdocumento);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dt);
                dt.TableName = "REPORTE DE GUIAS";
                dtreporteguias = dt;
                cnn.Close();
                return dt;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable ReporteCostoInventario(string idsucursal, string fechainicio, string fechafin)
        {
            try
            {
                DataTable dt = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_ReporteInventario", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dt);
                dt.TableName = "REPORTE COSTO INVENTARIO";
                cnn.Close();
                return dt;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarCostoInventarioAsync(string idsucursal, string fechainicio, string fechafin, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = ReporteCostoInventario(idsucursal, fechainicio, fechafin);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportecostoinventario" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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

        public async Task<mensajeJson> GenerarExcelReporteGuias(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtreporteguias;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "ReporteGuias" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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

        public DataTable ListarSucursales(int idsucursal)
        {
            try
            {
                DataTable dt = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_LISTAR_SUCURSAL_TIPO_IDSUC", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSUCURSAL", idsucursal);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dt);
                cnn.Close();
                return dt;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        //STOCK VALORIZADO

        //public DataTable stockvalorizado(string sucursal)
        //{
        //    try
        //    {

        //        if (sucursal is null) sucursal = "";

        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("almacen.SP_REPORTE_STOCK_VALORIZADO1", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;

        //        cmm.Parameters.AddWithValue("@sucursal", sucursal);


        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "STOCK PRODUCTOS";
        //        dtstock = tabla;
        //        cnn.Close();
        //        return tabla;
        //    }
        //    catch (Exception e)
        //    {
        //        return new DataTable();
        //    }

        //}

        public async Task<object[][]> stockvalorizado(string sucursal)
        {
            var resultList = new List<object[]>();
            try
            {
                // Convertir el string 'año/mes/dia' a DateTime



                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("almacen.SP_REPORTE_STOCK_VALORIZADO", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@sucursal", sucursal);
                        cmm.CommandTimeout = 0;

                        await cnn.OpenAsync();

                        using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var rowData = new object[reader.FieldCount];
                                reader.GetValues(rowData);
                                resultList.Add(rowData);
                            }
                        }
                    }
                }
            }
            catch (Exception vex)
            {
                // Considera registrar el error vex para diagnóstico.
                throw vex;
            }

            return resultList.ToArray();
        }

        public object[,] exportarexcelEpplus(string sucursal)
        {
            object[,] resultArray = null;
            //string[] headers = new string[]
            //{
            //    "SUCURSAL"," CODIGO PRODUCTO","FECHA","PRODUCTO","CLASE",
            //    "SUBCLASE","STOCK ACTUAL","PRECIO COMPRA","PRECIO VENTA","LOTE"

            // };

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("almacen.SP_REPORTE_STOCK_VALORIZADO", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        // Adding parameters
                        cmm.Parameters.AddWithValue("@sucursal", sucursal ?? "100");


                        using (SqlDataReader reader = cmm.ExecuteReader())
                        {
                            var tempData = new List<object[]>();
                            var columnCount = reader.FieldCount;
                            string[] headers = new string[columnCount];
                            for (int i = 0; i < columnCount; i++)
                            {
                                headers[i] = reader.GetName(i);
                            }
                            while (reader.Read())
                            {
                                object[] values = new object[columnCount];
                                reader.GetValues(values);
                                tempData.Add(values);
                            }

                            // Considerar espacio para la cabecera al inicializar resultArray
                            resultArray = new object[tempData.Count + 1, columnCount];

                            // Agregar la cabecera
                            for (int j = 0; j < headers.Length; j++)
                            {
                                resultArray[0, j] = headers[j];
                            }

                            // Llenar el resto del arreglo con los datos
                            for (int i = 0; i < tempData.Count; i++)
                            {
                                for (int j = 0; j < columnCount; j++)
                                {
                                    resultArray[i + 1, j] = tempData[i][j];
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultArray;
        }


        // Datos al docuemnto pdf
        public DataTable ReportePdfStock(string producto, string sucursal, string laboratorio, string almacen)
        {

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("almacen.SP_REPORTE_STOCK", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@producto", producto ?? "");
                cmm.Parameters.AddWithValue("@sucursal", sucursal ?? "");
                cmm.Parameters.AddWithValue("@top", 0);
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio ?? "");
                cmm.Parameters.AddWithValue("@almacen", almacen ?? "");
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }



    }
}
